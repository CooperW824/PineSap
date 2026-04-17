import  * as policies from "@/lib/server/authorization/policies";
import { User } from "@/lib/server/DatabaseModels/user";

export class Authorizer {
  private user: User;
  constructor(user: User) {
    this.user = user;
  }
  users(): policies.UserManagementPolicy {
    return new policies.UserManagementPolicy(this.user);
  }

  requests(): policies.RequestPolicy {
    return new policies.RequestPolicy(this.user);
  }

  items(): policies.ItemPolicy {
	  return new policies.ItemPolicy(this.user);
  }

}