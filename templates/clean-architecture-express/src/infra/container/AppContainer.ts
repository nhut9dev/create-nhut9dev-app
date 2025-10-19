import { Router } from 'express';

import { EnvConfig } from '~infra/config';


/**
 * AppContainer (Root Container)
 * Orchestrates all modules and provides a single entry point for dependency access.
 * Acts as a facade for all bounded context modules.
 *
 * To add a new module (e.g., ProductModule):
 * 1. Create ProductModule.ts in modules/
 * 2. Initialize it here: this._productModule = new ProductModule(this.sharedModule)
 * 3. Add getter: public get productModule()
 * 4. Update getAllRouters() to include product routes
 */
export class AppContainer {
  private envConfig: EnvConfig;

  // Modules
  // private _sharedModule?: SharedModule;
  // private _userModule?: UserModule;

  constructor(envConfig: EnvConfig) {
    this.envConfig = envConfig;
  }

  // ===== Modules =====

  // public get sharedModule(): SharedModule {
  //   if (!this._sharedModule) {
  //     this._sharedModule = new SharedModule(this.envConfig);
  //   }
  //   return this._sharedModule;
  // }

  // public get userModule(): UserModule {
  //   if (!this._userModule) {
  //     this._userModule = new UserModule(this.sharedModule);
  //   }
  //   return this._userModule;
  // }

  // ===== Utility Methods =====

  /**
   * Collects all route routers from all modules for Express app registration.
   * When adding new modules, update this method to include their routes.
   */
  public getAllRouters(): Router[] {
    return [
      // this.userModule.userRoutes.getRouter(),
    ];
  }
}
