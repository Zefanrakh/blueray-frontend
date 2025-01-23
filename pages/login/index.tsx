import { Button, Form, Input } from "ant-design-vue";
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  layout: "auth",
})
export default class LoginPage extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  private email: string = "";
  private password: string = "";

  // ---------------------------- FUNCTION ---------------------------

  private async handleLogin() {
    try {
      await this.$auth.loginWith("laravelSanctum", {
        data: {
          email: this.email,
          password: this.password,
        },
      });
      this.$router.push("/");
    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    }
  }

  // ---------------------------- RENDER ---------------------------

  render() {
    return (
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <h1>Login</h1>
        <Form
          onSubmit={(e: ErrorEvent) => {
            e.preventDefault();
            this.handleLogin();
          }}
        >
          <Form.Item label="Email">
            <Input vModel={this.email} placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password
              vModel={this.password}
              placeholder="Enter your password"
            />
          </Form.Item>
          <Button type="primary" block html-type="submit">
            Login
          </Button>
        </Form>
        <div style={{ textAlign: "center" }}>
          <nuxt-link to="/register">Don't have an account? Register</nuxt-link>
        </div>
      </div>
    );
  }
}
