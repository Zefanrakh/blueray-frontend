import { Component, Vue } from "nuxt-property-decorator";
import UserForm from "~/components/UserForm";

@Component
export default class UserProfilePage extends Vue {
  // ---------------------------- PROPERTIES ---------------------------

  get userId(): string | null {
    return (this.$auth.user?.id as string) || null;
  }

  // ---------------------------- RENDER ---------------------------

  render() {
    if (!this.userId) {
      return <div>Please select a user to view details</div>;
    }
    return <UserForm userId={String(this.userId)} />;
  }
}
