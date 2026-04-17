import  * as policies from "@/lib/server/authorization/policies";
import { User } from "@/lib/server/DatabaseModels/user";

/**
 * Authorizer class that checks if a user has permission to perform certain actions based on their role.
 *  It provides methods for checking permissions related to user management, request management, budget management, and item management.
 */
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

  budget(): policies.BudgetManagementPolicy {
    return new policies.BudgetManagementPolicy(this.user);
  }
  
  items(): policies.ItemPolicy {
	  return new policies.ItemPolicy(this.user);
  }

}