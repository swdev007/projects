export class UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  resetPasswordUniqueCode: string | null;
  zipCode: string = "";
  myStylist: string = "";
  isAdmin: boolean;
  accountVerified: boolean;
  phoneNumber: string;
  notes: string;
  isActive: boolean;
  address: string;
  createdAt: string;
  referralCode: string;
  shoppingRecsUrl: string;

  constructor(user: any) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.zipCode = user.zipCode;
    this.myStylist = user.myStylist;
    this.resetPasswordUniqueCode = user.resetPasswordUniqueCode;
    this.isAdmin = user?.isAdmin || false;
    this.accountVerified = user?.accountVerified || "";
    this.phoneNumber = user?.phoneNumber || "";
    this.notes = user?.notes || "";
    this.isActive = user?.isActive;
    this.address = user?.address || "";
    this.createdAt = user.createdAt
      ? new Date(user.createdAt).toUTCString()
      : "-";
    this.referralCode = user.referralCode || "";
    this.shoppingRecsUrl = user?.shoppingRecsUrl || '';
  }
}
