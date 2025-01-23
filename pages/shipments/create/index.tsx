import { Component, Vue } from "nuxt-property-decorator";
import {
  FormModel,
  Input,
  Button,
  Select,
  Row,
  Col,
  Card,
  message,
} from "ant-design-vue";
import { RequestShippingDto } from "~/types/RequestShippingDto";
import { ItemsCategoryEnum } from "~/enums/ItemsCategory";

@Component
export default class OrderShipment extends Vue {
  private formData: RequestShippingDto = {
    shipper_contact_name: null,
    shipper_contact_phone: null,
    shipper_contact_email: null,
    shipper_organization: null,
    origin_contact_name: null,
    origin_contact_phone: null,
    origin_address: null,
    origin_postal_code: null,
    origin_note: null,
    origin_coordinate: {
      latitude: null,
      longitude: null,
    },
    destination_contact_name: null,
    destination_contact_phone: null,
    destination_contact_email: null,
    destination_address: null,
    destination_postal_code: null,
    destination_note: null,
    destination_coordinate: {
      latitude: null,
      longitude: null,
    },
    courier_company: null,
    courier_type: null,
    delivery_type: null,
    order_note: null,
    items: [],
  };

  private couriersData: Array<{
    code: string;
    name: string;
    services: Array<{ courier_type: string; courier_type_name: string }>;
  }> = [];

  private get couriers() {
    return this.couriersData;
  }

  private get filteredServices() {
    const selectedCourier = this.couriersData.find(
      (courier) => courier.code === this.formData.courier_company
    );
    return selectedCourier ? selectedCourier.services : [];
  }

  async created() {
    try {
      const response = await this.$axios.get("/couriers");
      const data = response.data.data;

      this.couriersData = Object.keys(data).map((courierCode) => ({
        code: courierCode,
        name: data[courierCode][0]?.courier_name || courierCode,
        services: data[courierCode].map((service: any) => ({
          courier_type: service.courier_service_code,
          courier_type_name: service.courier_service_name,
        })),
      }));
    } catch (error) {
      message.error("Failed to fetch couriers. Please try again.");
    }
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    try {
      const response = await this.$axios.post("/shipments", this.formData);
      message.success("Order shipment successfully created!");
    } catch (error) {
      message.error("Failed to create shipment. Please try again.");
    }
  }

  private removeItem(index: number) {
    this.formData.items.splice(index, 1);
  }

  private addItem() {
    this.formData.items.push({
      name: "",
      description: "",
      category: "",
      value: 0,
      quantity: 1,
      height: 0,
      length: 0,
      weight: 0,
      width: 0,
    });
  }

  render() {
    return (
      <Card
        title="Create Order Shipment"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "16px",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        <FormModel ref="formRef" layout="vertical" onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Shipper Name"
                name="shipper_contact_name"
                rules={[
                  { required: true, message: "Please input shipper name!" },
                ]}
              >
                <Input
                  vModel={this.formData.shipper_contact_name}
                  placeholder="Shipper Name"
                />
              </FormModel.Item>
            </Col>
            <Col span={12}>
              <FormModel.Item
                label="Shipper Phone"
                name="shipper_contact_phone"
                rules={[
                  { required: true, message: "Please input shipper phone!" },
                ]}
              >
                <Input
                  vModel={this.formData.shipper_contact_phone}
                  placeholder="0123456789"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Shipper Email"
                name="shipper_contact_email"
                rules={[
                  { required: true, message: "Please input shipper email!" },
                ]}
              >
                <Input
                  vModel={this.formData.shipper_contact_email}
                  placeholder="shipper@email.com"
                />
              </FormModel.Item>
            </Col>
            <Col span={12}>
              <FormModel.Item
                label="Shipper Organization"
                name="shipper_organization"
                rules={[
                  {
                    required: true,
                    message: "Please input shipper organization!",
                  },
                ]}
              >
                <Input
                  vModel={this.formData.shipper_organization}
                  placeholder="Shipper Organization"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Origin Name"
                name="origin_contact_name"
                rules={[
                  { required: true, message: "Please input origin name!" },
                ]}
              >
                <Input
                  vModel={this.formData.origin_contact_name}
                  placeholder="Origin Name"
                />
              </FormModel.Item>
            </Col>
            <Col span={12}>
              <FormModel.Item
                label="Origin Phone"
                name="origin_contact_phone"
                rules={[
                  { required: true, message: "Please input origin phone!" },
                ]}
              >
                <Input
                  vModel={this.formData.origin_contact_phone}
                  placeholder="0123456789"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Origin Address"
                name="origin_address"
                rules={[
                  { required: true, message: "Please input origin address!" },
                ]}
              >
                <Input
                  vModel={this.formData.origin_address}
                  placeholder="Origin Address"
                />
              </FormModel.Item>
            </Col>
            <Col span={12}>
              <FormModel.Item
                label="Origin Postal Code"
                name="origin_postal_code"
                rules={[
                  { required: true, message: "Please input postal code!" },
                ]}
              >
                <Input
                  vModel={this.formData.origin_postal_code}
                  placeholder="15124"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <FormModel.Item label="Origin Note" name="origin_note">
                <Input
                  vModel={this.formData.origin_note}
                  placeholder="Optional note"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Destination Contact Name"
                name="destination_contact_name"
                rules={[
                  { required: true, message: "Please input destination name!" },
                ]}
              >
                <Input
                  vModel={this.formData.destination_contact_name}
                  placeholder="destination Name"
                />
              </FormModel.Item>
            </Col>
            <Col span={12}>
              <FormModel.Item
                label="Destination Contact Phone"
                name="destination_contact_phone"
                rules={[
                  {
                    required: true,
                    message: "Please input destination phone!",
                  },
                ]}
              >
                <Input
                  vModel={this.formData.destination_contact_phone}
                  placeholder="0123456789"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Destination Contact Email"
                name="destination_contact_email"
                rules={[
                  {
                    required: true,
                    message: "Please input destination email!",
                  },
                ]}
              >
                <Input
                  vModel={this.formData.destination_contact_email}
                  placeholder="destination@email.com"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Destination Address"
                name="destination_address"
                rules={[
                  {
                    required: true,
                    message: "Please input destination address!",
                  },
                ]}
              >
                <Input
                  vModel={this.formData.destination_address}
                  placeholder="Destination Address"
                />
              </FormModel.Item>
            </Col>
            <Col span={12}>
              <FormModel.Item
                label="Destination Postal Code"
                name="destination_postal_code"
                rules={[
                  { required: true, message: "Please input postal code!" },
                ]}
              >
                <Input
                  vModel={this.formData.destination_postal_code}
                  placeholder="15124"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <FormModel.Item label="Destination Note" name="destination_note">
                <Input
                  vModel={this.formData.destination_note}
                  placeholder="Optional note"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Courier Company"
                name="courier_company"
                rules={[
                  { required: true, message: "Please select courier company!" },
                ]}
              >
                <Select
                  vModel={this.formData.courier_company}
                  placeholder="Select Courier Company"
                >
                  {this.couriers.map((courier) => (
                    <Select.Option key={courier.code} value={courier.code}>
                      {courier.name}
                    </Select.Option>
                  ))}
                </Select>
              </FormModel.Item>
            </Col>
            <Col span={12}>
              <FormModel.Item
                label="Courier Type"
                name="courier_type"
                rules={[
                  { required: true, message: "Please select courier type!" },
                ]}
              >
                <Select
                  vModel={this.formData.courier_type}
                  placeholder="Select Courier Type"
                >
                  {this.filteredServices.map((service) => (
                    <Select.Option
                      key={service.courier_type}
                      value={service.courier_type}
                    >
                      {service.courier_type_name}
                    </Select.Option>
                  ))}
                </Select>
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Delivery Type"
                name="delivery_type"
                rules={[
                  { required: true, message: "Please select courier company!" },
                ]}
              >
                <Select
                  vModel={this.formData.delivery_type}
                  placeholder="Select Delivery Type"
                >
                  <Select.Option key="now" value="now">
                    Now
                  </Select.Option>
                  <Select.Option key="scheduled" value="scheduled">
                    Scheduled
                  </Select.Option>
                </Select>
              </FormModel.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <FormModel.Item label="Order Note" name="order_note">
                <Input
                  vModel={this.formData.order_note}
                  placeholder="Order note"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Origin Latitude"
                name="origin_coordinate.latitude"
                rules={[
                  { required: true, message: "Please input origin latitude!" },
                ]}
              >
                <Input
                  v-model={this.formData.origin_coordinate.latitude}
                  placeholder="-6.225314"
                />
              </FormModel.Item>
            </Col>
            <Col span={12}>
              <FormModel.Item
                label="Origin Longitude"
                name="origin_coordinate.longitude"
                rules={[
                  { required: true, message: "Please input origin longitude!" },
                ]}
              >
                <Input
                  v-model={this.formData.origin_coordinate.longitude}
                  placeholder="106.7993735"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormModel.Item
                label="Destination Latitude"
                name="destination_coordinate.latitude"
                rules={[
                  {
                    required: true,
                    message: "Please input destination latitude!",
                  },
                ]}
              >
                <Input
                  v-model={this.formData.destination_coordinate.latitude}
                  placeholder="-6.28927"
                />
              </FormModel.Item>
            </Col>
            <Col span={12}>
              <FormModel.Item
                label="Destination Longitude"
                name="destination_coordinate.longitude"
                rules={[
                  {
                    required: true,
                    message: "Please input destination longitude!",
                  },
                ]}
              >
                <Input
                  v-model={this.formData.destination_coordinate.longitude}
                  placeholder="106.774920"
                />
              </FormModel.Item>
            </Col>
          </Row>

          <div style={{ marginTop: "24px", marginBottom: "24px" }}>
            <h3>Items</h3>
            {this.formData.items.map((item, index) => (
              <Card
                key={index}
                title={`Item ${index + 1}`}
                extra={
                  <Button
                    type="text"
                    danger
                    onClick={() => this.removeItem(index)}
                  >
                    Remove
                  </Button>
                }
                style={{ marginBottom: "16px" }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <FormModel.Item
                      label="Name"
                      required
                      rules={[
                        { required: true, message: "Please input name!" },
                      ]}
                    >
                      <Input
                        vModel={this.formData.items[index].name}
                        placeholder="Item Name"
                      />
                    </FormModel.Item>
                  </Col>
                  <Col span={12}>
                    <FormModel.Item
                      label="Description"
                      required
                      rules={[
                        {
                          required: true,
                          message: "Please input description!",
                        },
                      ]}
                    >
                      <Input
                        vModel={this.formData.items[index].description}
                        placeholder="Item Description"
                      />
                    </FormModel.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormModel.Item
                      label="Category"
                      required
                      rules={[
                        { required: true, message: "Please input category!" },
                      ]}
                    >
                      <Select
                        vModel={this.formData.items[index].category}
                        placeholder="Select Category"
                      >
                        {Object.values(ItemsCategoryEnum).map((category) => (
                          <Select.Option key={category} value={category}>
                            {category.replace("_", " ")}
                          </Select.Option>
                        ))}
                      </Select>
                    </FormModel.Item>
                  </Col>
                  <Col span={12}>
                    <FormModel.Item
                      label="Value"
                      required
                      rules={[
                        { required: true, message: "Please input value!" },
                      ]}
                    >
                      <Input
                        type="number"
                        vModel={this.formData.items[index].value}
                        placeholder="Item Value"
                      />
                    </FormModel.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <FormModel.Item
                      label="Quantity"
                      required
                      rules={[
                        { required: true, message: "Please input quantity!" },
                      ]}
                    >
                      <Input
                        type="number"
                        vModel={this.formData.items[index].quantity}
                        placeholder="Quantity"
                      />
                    </FormModel.Item>
                  </Col>
                  <Col span={6}>
                    <FormModel.Item
                      label="Height"
                      required
                      rules={[
                        { required: true, message: "Please input height!" },
                      ]}
                    >
                      <Input
                        type="number"
                        vModel={this.formData.items[index].height}
                        placeholder="Height"
                      />
                    </FormModel.Item>
                  </Col>
                  <Col span={6}>
                    <FormModel.Item
                      label="Length"
                      required
                      rules={[
                        { required: true, message: "Please input length!" },
                      ]}
                    >
                      <Input
                        type="number"
                        vModel={this.formData.items[index].length}
                        placeholder="Length"
                      />
                    </FormModel.Item>
                  </Col>
                  <Col span={6}>
                    <FormModel.Item
                      label="Width"
                      required
                      rules={[
                        { required: true, message: "Please input width!" },
                      ]}
                    >
                      <Input
                        type="number"
                        vModel={this.formData.items[index].width}
                        placeholder="Width"
                      />
                    </FormModel.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <FormModel.Item
                      label="Weight"
                      required
                      rules={[
                        { required: true, message: "Please input weight!" },
                      ]}
                    >
                      <Input
                        type="number"
                        vModel={this.formData.items[index].weight}
                        placeholder="Weight"
                      />
                    </FormModel.Item>
                  </Col>
                </Row>
              </Card>
            ))}
            <Button
              type="dashed"
              block
              style={{ marginTop: "16px" }}
              onClick={this.addItem}
            >
              Add Item
            </Button>
          </div>

          <FormModel.Item>
            <Button type="primary" htmlType="submit">
              Create Shipment
            </Button>
          </FormModel.Item>
        </FormModel>
      </Card>
    );
  }
}
