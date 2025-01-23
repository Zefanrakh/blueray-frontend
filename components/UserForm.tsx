import { Button, Form, Input, Select } from "ant-design-vue";
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { UserRole } from "~/enums/UserRoleEnum";
import { ReadUserDto } from "~/types/ReadUserDto";
import getErrorMessage from "~/utils/getErrorMessage";

@Component
export default class UserForm extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  @Prop({ type: String, required: true }) public userId!: string;
  private get localUserId(): string | null {
    return this.userId;
  }
  private user: ReadUserDto = {
    email: "",
    name: "",
    role: UserRole.Admin,
  } as ReadUserDto;
  private isLoading: boolean = false;
  private isSaving: boolean = false;

  // ---------------------------- FETCHER ---------------------------

  private async fetchUser() {
    this.isLoading = true;

    try {
      const response = await this.$axios.get(`/users/${this.localUserId}`);
      this.user = response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      this.isLoading = false;
    }
  }

  // ---------------------------- FUNCTION ---------------------------

  private async saveUser() {
    try {
      this.isSaving = true;
      await this.$axios.put(`/users/${this.user?.id}`, this.user);
      this.$message.success("User updated successfully");
      this.$router.push("/users");
    } catch (error: any) {
      console.error(
        "Error saving user:",
        getErrorMessage(error) || error.message
      );
      this.$message.error(getErrorMessage(error) || error.message);
    } finally {
      this.isSaving = false;
    }
  }

  private async handleCancel() {
    this.$router.push("/users");
  }

  // ---------------------------- RENDER ---------------------------

  render() {
    if (this.isLoading) {
      return <a-spin tip="Loading user data..." />;
    }

    if (!this.user) {
      return <div>Please select a user to view details</div>;
    }

    return (
      <div>
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input vModel={this.user.name} />
          </Form.Item>
          <Form.Item label="Email">
            <Input vModel={this.user.email} disabled />
          </Form.Item>
          <Form.Item label="Role">
            <Select vModel={this.user.role}>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
          <div style="display: flex; gap: 8px;">
            <Button
              type="primary"
              loading={this.isSaving}
              onClick={this.saveUser}
            >
              Save Changes
            </Button>
            <div style="display: flex; gap: 8px;">
              <Button onClick={this.handleCancel}>Cancel</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }

  // ---------------------------- LIFE CYCLE HOOKS ---------------------------

  created() {
    this.fetchUser();
  }
}
