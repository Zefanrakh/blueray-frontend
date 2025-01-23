const authShipment = async ({ $auth, params, $axios, redirect, error }) => {
  try {
    const shipmentId = params.id;
    const userId = $auth.$state.user?.id;

    const shipmentResponse = await $axios.get(`/shipments/${shipmentId}`);
    const userResponse = await $axios.get(`/users/${userId}`);

    const shipment = shipmentResponse.data;
    const authUser = userResponse.data;

    if (authUser.role !== "admin" && shipment.user_id !== authUser.id) {
      return redirect(
        `/?error=unauthorized?data=${JSON.stringify({ shipment, authUser })}`
      );
    }
  } catch (err: any) {
    console.log({ err });
    if (err.response?.status === 403 || err.response?.status === 404) {
      return redirect(`/?error=unauthorized`);
    }

    error({ statusCode: err.response?.status || 500, message: err.message });
  }
};

export default authShipment;
