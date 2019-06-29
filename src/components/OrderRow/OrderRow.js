import React from 'react';
// import ordersData from '../../helpers/data/ordersData';
import moment from 'moment';
import PropTypes from 'prop-types';

import orderShape from '../../helpers/propz/orderShapes';

class OrderRow extends React.Component {
  static propTypes = {
    order: orderShape.orderShape,
    deleteOrder: PropTypes.func.isRequired,
  }

  deleteOrderEvent = (e) => {
    const { order, deleteOrder } = this.props;
    e.preventDefault();
    deleteOrder(order.id);
  }

  render() {
    const { order } = this.props;
    const numFish = Object.values(order.fishes).reduce((a, b) => a + b);
    return (
      <tr>
        <th>{order.name}</th>
        <td>{moment(order.dateTime).format('LLL')}</td>
        <td>{numFish}</td>
        <td><button className="btn btn-outline-danger" onClick={this.deleteOrderEvent}>x</button></td>
      </tr>
    );
  }
}

export default OrderRow;
