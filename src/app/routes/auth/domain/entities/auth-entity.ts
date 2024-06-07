interface AuthEssentials {
  username: string;
  password: string;
}

export type AuthProperties = Required<AuthEssentials>;

export class AuthEntity {
  private readonly username!: string;
  private password!: string;

  constructor(properties: AuthProperties) {
    Object.assign(this, properties);
  }

  properties(): AuthProperties {
    return {
      username: this.username,
      password: this.password,
    };
  }
}
