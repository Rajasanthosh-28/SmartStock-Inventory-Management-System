package com.inventory.security;

import com.inventory.model.AdminUser;
import com.inventory.service.AdminUserService;
import com.inventory.service.JwtService;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WebSocketJwtInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final AdminUserService adminUserService;

    public WebSocketJwtInterceptor(
            JwtService jwtService,
            AdminUserService adminUserService) {

        this.jwtService = jwtService;
        this.adminUserService = adminUserService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }

        // 1. Authenticate WebSocket connection
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authorization =
                    accessor.getFirstNativeHeader("Authorization");

            if (authorization == null ||
                    !authorization.startsWith("Bearer ")) {

                throw new MessageDeliveryException(
                        "Missing or invalid Authorization header"
                );
            }

            String token = authorization.substring(7);

            String email = jwtService.extractEmail(token);

            if (!jwtService.validateToken(token, email)) {
                throw new MessageDeliveryException(
                        "Invalid or expired JWT token"
                );
            }

            AdminUser user = adminUserService.findByEmail(email);

            if (user == null) {
                throw new MessageDeliveryException(
                        "Admin user not found"
                );
            }

            String tokenRole = jwtService.extractRole(token);

            if (!"ADMIN".equals(user.getRole()) ||
                    !user.getRole().equals(tokenRole)) {

                throw new MessageDeliveryException(
                        "Only Admin users can access WebSocket topics"
                );
            }

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority("ROLE_ADMIN")
                            )
                    );

            accessor.setUser(authentication);
        }

        // 2. Authorize subscriptions
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {

            if (!(accessor.getUser() instanceof Authentication authentication)
                    || authentication.getAuthorities().stream()
                    .noneMatch(authority ->
                            "ROLE_ADMIN".equals(authority.getAuthority()))) {

                throw new MessageDeliveryException(
                        "Unauthorized WebSocket subscription"
                );
            }

            String destination = accessor.getDestination();

            boolean allowedDestination =
                    "/topic/notifications".equals(destination)
                    || "/topic/notifications/unread-count".equals(destination)
                    || "/topic/dashboard".equals(destination);

            if (!allowedDestination) {
                throw new MessageDeliveryException(
                        "Subscription to this destination is not allowed"
                );
            }
        }

        // 3. Prevent client-side message sending
        if (StompCommand.SEND.equals(accessor.getCommand())) {

            throw new MessageDeliveryException(
                    "Client message sending is not allowed"
            );
        }

        return message;
    }
}