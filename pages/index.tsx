import { Vue, Component } from "nuxt-property-decorator";

@Component
export default class HomePage extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  private get user() {
    return this.$auth.user;
  }

  // ---------------------------- FUNCTION ---------------------------

  private async logout() {
    await this.$auth.logout();
    this.$router.push("/login");
  }

  // ---------------------------- RENDER ---------------------------

  render() {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Welcome to Dashboard</h1>
        {this.user ? (
          <div>
            <p>Welcome, {this.user.name}!</p>
            <a-button type="danger" onClick={this.logout}>
              Logout
            </a-button>
          </div>
        ) : (
          <p>You are not logged in.</p>
        )}
      </div>
    );
  }

  // ---------------------------- LIFE CYCLE HOOKS ---------------------------

  mounted() {
    if (this.$route.query.error === "unauthorized") {
      this.$message.error("You are not authorized to access this shipment.");
    }
  }
}
