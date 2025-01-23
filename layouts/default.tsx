import { Vue, Component } from "nuxt-property-decorator";
import Sidebar from "@/components/Sidebar";

@Component
export default class DefaultLayout extends Vue {
  render() {
    return (
      <div style="display: flex; height: 100vh;">
        <aside style="width: 250px; background-color: #f0f2f5; padding: 10px;">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main style="flex-grow: 1; padding: 20px;">
          <nuxt />
        </main>
      </div>
    );
  }
}
