import { Component, Vue } from "nuxt-property-decorator";
import UserForm from "~/components/UserForm";

@Component({
  meta: { requiredRoles: ["admin"] },
})
export default class UserDetailPage extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  get userId(): string | null {
    return this.$route.params.id || null;
  }

  // ---------------------------- RENDER ---------------------------

  render() {
    if (!this.userId) {
      return <div>Please select a user to view details</div>;
    }
    return <UserForm userId={this.userId} />;
  }
}
