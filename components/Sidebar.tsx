import { Vue, Component } from "nuxt-property-decorator";

@Component
export default class Sidebar extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  private get menuItems() {
    const userRole = this.$auth.user?.role as string;

    let items = [
      { name: "Home", path: "/" },
      { name: "Profile", path: "/profile" },
      { name: "Users", path: "/users", role: ["admin"] },
      {
        name: "Your Shipments",
        path: "/shipments",
      },
      {
        name: "User Shipments",
        path: "/users-shipments",
        role: ["admin"],
      },
    ];

    items = items.filter(
      (item) => !item.role || !item.role.length || item.role.includes(userRole)
    );

    return items;
  }

  // ---------------------------- RENDER ---------------------------

  render() {
    return (
      <div
        style={{
          width: "250px",
          background: "#001529",
          color: "#fff",
          height: "100vh",
          padding: "20px",
        }}
      >
        <h2 style={{ color: "#fff" }}>Menu</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {this.menuItems.map((item) => (
            <li key={item.name} style={{ marginBottom: "10px" }}>
              <nuxt-link
                to={item.path}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                {item.name}
              </nuxt-link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
