import { Component, Vue } from "nuxt-property-decorator";
import { Table, Button, message } from "ant-design-vue";
import { ReadShippingDto } from "~/types/ReadShippingDto";
import { ReadUserOrderStatsDto } from "~/types/ReadUserOrderStatDto";
import dayjs from "dayjs";

@Component({
  meta: { requiredRoles: ["admin"] },
})
export default class AdminShipmentOrders extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  private expandedRowKeys: number[] = [];
  private dataSource: ReadUserOrderStatsDto[] = [];
  private ordersData: Record<number, ReadShippingDto[]> = {};
  private columns = [
    { title: "User Name", dataIndex: "user_name", key: "user_name" },
    { title: "Email", dataIndex: "user_email", key: "user_email" },
    { title: "Orders", dataIndex: "order_count", key: "order_count" },
  ];

  // ---------------------------- FETCHER ---------------------------

  private async fetchUserOrders(userId: number) {
    if (!this.ordersData[userId]) {
      try {
        const response = await this.$axios.get(`/dashboard/user/${userId}`);
        this.$set(this.ordersData, userId, response.data.data);
      } catch (error) {
        message.error("Failed to fetch user orders. Please try again.");
      }
    }
  }

  // ---------------------------- FUNCTION ---------------------------

  private async handleRowExpand(
    expanded: boolean,
    record: ReadUserOrderStatsDto
  ) {
    if (expanded) {
      this.expandedRowKeys = [...this.expandedRowKeys, record.id];
      await this.fetchUserOrders(record.id);
    } else {
      this.expandedRowKeys = this.expandedRowKeys.filter(
        (key) => key !== record.id
      );
    }
  }

  private handleOrderClick(order: any) {
    this.$router.push(`/shipments/${order.biteship_order_id}`);
  }

  // ---------------------------- RENDER ---------------------------

  private renderUserOrdersTable(userId: number) {
    const orders = this.ordersData[userId] || [];
    return (
      <Table
        dataSource={orders}
        rowKey="id"
        pagination={false}
        columns={[
          { title: "Order ID", dataIndex: "id", key: "id" },
          {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            customRender: (text: string) =>
              dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            title: "Updated At",
            dataIndex: "updated_at",
            key: "updated_at",
            customRender: (text: string) =>
              dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            title: "Actions",
            key: "actions",
            customRender: (_, record: ReadShippingDto) => (
              <Button type="link" onClick={() => this.handleOrderClick(record)}>
                View Details
              </Button>
            ),
          },
        ]}
      />
    );
  }

  render() {
    return (
      <div>
        <h2>User Shipments</h2>
        <Table
          dataSource={this.dataSource}
          columns={this.columns}
          rowKey="id"
          expandedRowKeys={this.expandedRowKeys}
          expandedRowRender={(record: ReadUserOrderStatsDto) =>
            this.renderUserOrdersTable(record.id)
          }
          onExpand={(expanded: boolean, record: ReadUserOrderStatsDto) =>
            this.handleRowExpand(expanded, record)
          }
        />
      </div>
    );
  }

  // ---------------------------- LIFE CYCLE HOOKS ---------------------------

  async created() {
    try {
      const response = await this.$axios.get("/dashboard/admin");
      this.dataSource = response.data.data.statistics;
    } catch (error) {
      message.error("Failed to fetch data. Please try again.");
    }
  }
}
