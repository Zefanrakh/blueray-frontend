import { Vue, Component } from "nuxt-property-decorator";
import { Button, Form, Input, Select } from "ant-design-vue";
import getErrorMessage from "~/utils/getErrorMessage";

@Component({
  auth: false,
  middleware: ["guest"],
  layout: "auth",
})
export default class RegisterPage extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  private name: string = "";
  private email: string = "";
  private password: string = "";
  private password_confirmation: string = "";
  private role: "admin" | "user" = "admin";

  // ---------------------------- FUNCTION ---------------------------

  private async handleRegister() {
    try {
      await this.$axios.post("/register", {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
        role: this.role,
      });
      this.$message.success("User registered successfully");
      this.$router.push("/login");
    } catch (error: any) {
      console.error(
        "Register failed:",
        getErrorMessage(error) || error.message
      );
      this.$message.error(getErrorMessage(error) || error.message);
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
        <h1>Register</h1>
        <Form
          onSubmit={(e: ErrorEvent) => {
            e.preventDefault();
            this.handleRegister();
          }}
        >
          <Form.Item label="Name">
            <Input vModel={this.name} placeholder="Enter your name" />
          </Form.Item>
          <Form.Item label="Email">
            <Input vModel={this.email} placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password
              vModel={this.password}
              placeholder="Enter your password"
            />
          </Form.Item>
          <Form.Item label="Password Confirmation">
            <Input.Password
              vModel={this.password_confirmation}
              placeholder="Re-enter your password"
            />
          </Form.Item>
          <Form.Item label="Role">
            <Select vModel={this.role}>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" block html-type="submit">
            Register
          </Button>
        </Form>
        <div style={{ textAlign: "center" }}>
          <nuxt-link to="/login">Already have an account? Login</nuxt-link>
        </div>
      </div>
    );
  }
}
