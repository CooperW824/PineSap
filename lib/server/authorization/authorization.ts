import  * as policies from "@/lib/server/authorization/policies";
import { User } from "@/lib/server/DatabaseModels/user";

/**
 * - Authorizer class that checks if a user has permission to perform certain actions based on their role.
 * - Acts as a **factory** for creating policy instances that can be used to check permissions for different actions in the application.
 * - Each method in the Authorizer class returns an instance of a specific policy class that corresponds
 * to a particular area of authorization (e.g., user management, request handling, budget management, item management).
 *
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