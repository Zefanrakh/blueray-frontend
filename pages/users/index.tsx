import { Component, Vue } from "nuxt-property-decorator";
import { Button, Table } from "ant-design-vue";
import { ReadUserDto } from "~/types/ReadUserDto";
import getErrorMessage from "~/utils/getErrorMessage";

@Component({
  meta: { requiredRoles: ["admin"] },
})
export default class UsersPage extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  private users: ReadUserDto[] = [];
  private isLoading: boolean = false;
  private pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: (page: number) => {
      this.pagination.current = page;
      this.fetchUsers();
    },
  };
  private columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      scopedSlots: { customRender: "action" },
    },
  ];

  // ---------------------------- FUNCTION ---------------------------

  private async fetchUsers() {
    this.isLoading = true;
    try {
      const response = await this.$axios.get(`/users`, {
        params: { page: this.pagination.current },
      });
      this.users = response.data.data;
      this.pagination.total = response.data.total;
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      this.isLoading = false;
    }
  }

  private async deleteUser(id: string) {
    try {
      if (id === this.$auth.user?.id) {
        this.$message.error("Cannot delete yourself");
      }
      await this.$axios.delete(`/users/${id}`);
      this.$message.success("User deleted successfully");
      this.fetchUsers();
    } catch (error: any) {
      console.error(
        "Error deleting user:",
        getErrorMessage(error) || error.message
      );
      this.$message.error(getErrorMessage(error) || error.message);
    }
  }

  private handleTableChange() {
    this.fetchUsers();
  }

  private handleRowClick(record: ReadUserDto) {
    this.$router.push(`/users/${record.id}`);
  }

  // ---------------------------- RENDER ---------------------------

  render() {
    return (
      <div>
        <h2>Users</h2>
        <Table
          dataSource={this.users}
          columns={this.columns}
          rowKey="id"
          loading={this.isLoading}
          customRow={(record: ReadUserDto) => {
            return {
              on: {
                click: () => this.handleRowClick(record),
              },
            };
          }}
          onChange={this.handleTableChange}
          pagination={this.pagination}
          scopedSlots={{
            action: (record: ReadUserDto) => (
              <Button
                type="danger"
                disabled={record.id === this.$auth.user?.id}
                size="small"
                onClick={(event: Event) => {
                  event.stopPropagation();
                  this.deleteUser(record.id);
                }}
              >
                Delete
              </Button>
            ),
          }}
        />
      </div>
    );
  }

  // ---------------------------- LIFE CYCLE HOOKS ---------------------------

  created() {
    this.fetchUsers();
  }
}
