import { Component, Vue } from "nuxt-property-decorator";
import { Card, Table, Row, Col } from "ant-design-vue";
import dayjs from "dayjs";

@Component({
  middleware: "auth-shipment",
})
export default class ShipmentDetail extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  private shipmentData: any = null;
  private trackingData: any = null;
  private isLoading: boolean = true;

  // ---------------------------- RENDER ---------------------------

  render() {
    if (this.isLoading) {
      return <div>Loading...</div>;
    }

    if (!this.shipmentData || !this.trackingData) {
      return <div>No data available</div>;
    }

    const columns = [
      {
        title: "Service Type",
        dataIndex: "service_type",
        key: "service_type",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
      },
      {
        title: "Updated At",
        dataIndex: "updated_at",
        key: "updated_at",
        customRender: (text: string) => (
          <span>{dayjs(text).format("YYYY-MM-DD HH:mm")}</span>
        ),
      },
    ];

    return (
      <div style={{ padding: "20px" }}>
        <Card
          title="Shipment Details"
          bordered={false}
          style={{ marginBottom: "20px" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <p>
                <strong>Shipment ID:</strong> {this.shipmentData.id}
              </p>
              <p>
                <strong>Status:</strong> {this.shipmentData.status}
              </p>
              <p>
                <strong>Price:</strong> Rp{" "}
                {this.shipmentData.price.toLocaleString()}
              </p>
              <p>
                <strong>Note:</strong> {this.shipmentData.note || "-"}
              </p>
            </Col>
            <Col span={12}>
              <p>
                <strong>Courier:</strong> {this.shipmentData.courier.company}
              </p>
              <p>
                <strong>Tracking ID:</strong> {this.trackingData.id}
              </p>
              <p>
                <strong>Tracking Link:</strong>{" "}
                <a href={this.trackingData.link} target="_blank">
                  {this.trackingData.link}
                </a>
              </p>
            </Col>
          </Row>
        </Card>

        <Card
          title="Origin Details"
          bordered={false}
          style={{ marginBottom: "20px" }}
        >
          <p>
            <strong>Contact Name:</strong>{" "}
            {this.shipmentData.origin.contact_name}
          </p>
          <p>
            <strong>Address:</strong> {this.shipmentData.origin.address}
          </p>
          <p>
            <strong>Postal Code:</strong> {this.shipmentData.origin.postal_code}
          </p>
          <p>
            <strong>Coordinate:</strong>{" "}
            {this.shipmentData.origin.coordinate.latitude},{" "}
            {this.shipmentData.origin.coordinate.longitude}
          </p>
        </Card>

        <Card
          title="Destination Details"
          bordered={false}
          style={{ marginBottom: "20px" }}
        >
          <p>
            <strong>Contact Name:</strong>{" "}
            {this.shipmentData.destination.contact_name}
          </p>
          <p>
            <strong>Address:</strong> {this.shipmentData.destination.address}
          </p>
          <p>
            <strong>Postal Code:</strong>{" "}
            {this.shipmentData.destination.postal_code}
          </p>
          <p>
            <strong>Coordinate:</strong>{" "}
            {this.shipmentData.destination.coordinate.latitude},{" "}
            {this.shipmentData.destination.coordinate.longitude}
          </p>
        </Card>

        <Card title="Tracking History" bordered={false}>
          <Table
            dataSource={this.trackingData.history}
            columns={columns}
            rowKey="updated_at"
            pagination={false}
          />
        </Card>
      </div>
    );
  }

  // ---------------------------- LIFE CYCLE HOOKS ---------------------------

  async created() {
    const shipmentId = this.$route.params.id;

    try {
      const response = await this.$axios.get(`/shipments/${shipmentId}`);
      this.shipmentData = response.data.biteship_order_data;
      this.trackingData = response.data.tracking_data;
    } catch (error) {
      this.$message.error("Failed to load shipment details");
    } finally {
      this.isLoading = false;
    }
  }
}
