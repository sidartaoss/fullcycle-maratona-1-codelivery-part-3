import { Card, ListItemText } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const OrderInformation = (props) => {
  const { order } = props;

  console.log(order);

  function labelStatus(status) {
    // eslint-disable-next-line default-case
    switch (status) {
      case 1:
        return "Pedido Pendente";
      case 2:
        return "Pedido Entregue";
    }
  }

  return (
    <Card>
      <List>
        <ListItem>
          <ListItemText
            primary={order.driver_name}
            secondary={labelStatus(order.status)}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            secondary={`Local de entrega: Destino ${order.location_id}`}
          />
        </ListItem>
      </List>
    </Card>
  );
};

export default OrderInformation;
