import { Component, Vue } from "nuxt-property-decorator";
import { Table, Button, message } from "ant-design-vue";
import { ReadShippingDto } from "~/types/ReadShippingDto";
import dayjs from "dayjs";

@Component
export default class AdminShipmentOrders extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  private dataSource: ReadShippingDto[] = [];

  // ---------------------------- FUNCTION ---------------------------

  private navigateToCreateShipment() {
    this.$router.push("/shipments/create");
  }

  private handleOrderClick(order: any) {
    this.$router.push(`/shipments/${order.biteship_order_id}`);
  }

  // ---------------------------- RENDER ---------------------------

  render() {
    const columns = [
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
    ];
    return (
      <div>
        <Button
          type="primary"
          onClick={this.navigateToCreateShipment}
          style={{ marginBottom: "16px" }}
        >
          Create Shipment
        </Button>
        <h2>Your Shipments</h2>
        <Table
          dataSource={this.dataSource}
          rowKey="id"
          pagination={false}
          columns={columns}
        />
      </div>
    );
  }

  // ---------------------------- LIFE CYCLE HOOKS ---------------------------

  async created() {
    try {
      const response = await this.$axios.get(
        `/dashboard/user/${this.$auth.user?.id}`
      );
      this.dataSource = response.data.data;
    } catch (error) {
      message.error("Failed to fetch data. Please try again.");
    }
  }
}
