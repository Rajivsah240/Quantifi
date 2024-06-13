import * as React from "react";
import { Icon } from "@rneui/base";

export default () => {
  return (
    <Icon
      color="#0CC"
      containerStyle={{}}
      disabledStyle={{}}
      iconProps={{}}
      iconStyle={{}}
      name="devices"
      onLongPress={() => console.log("onLongPress()")}
      onPress={() => console.log("onPress()")}
      size={40}
      type="material"
    />
  );
}