package inventory.model;

public class Supplier {

    private int supplierId;
    private String supplierName;
    private String phoneNumber;
    private String email;
    private String address;

    public Supplier(int supplierId, String supplierName,
                    String phoneNumber, String email, String address) {

        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.address = address;
    }

    public int getSupplierId() {
        return supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void displaySupplier() {
        System.out.println("\n========== SUPPLIER DETAILS ==========");
        System.out.println("Supplier ID   : " + supplierId);
        System.out.println("Supplier Name : " + supplierName);
        System.out.println("Phone Number  : " + phoneNumber);
        System.out.println("Email         : " + email);
        System.out.println("Address       : " + address);
        System.out.println("======================================");
    }
}