import { useEffect } from "react";
import adminAuthService from "../services/adminAuthService";
import { syncPendingChanges } from "../services/syncService";

function OfflineSyncManager() {

  useEffect(() => {

    const handleOnline = async () => {
      if (!adminAuthService.isAuthenticated()) {
        return;
      }

      try {
        const result = await syncPendingChanges();

        console.log("SmartStock sync result:", result);

      } catch (error) {
        console.error("SmartStock automatic sync failed:", error);
      }
    };

    window.addEventListener("online", handleOnline);

    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };

  }, []);

  return null;
}

export default OfflineSyncManager;