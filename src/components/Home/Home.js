import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import Inventory from '../Inventory/Inventory';
import NewOrder from '../NewOrder/NewOrder';
import Orders from '../Orders/Orders';

import fishData from '../../helpers/data/fishData';
import ordersData from '../../helpers/data/ordersData';

import './Home.scss';

class Home extends React.Component {
  state = {
    orders: [],
    fishes: [],
    fishOrder: {},
    orderEditing: {},
  }

  getOrders = () => {
    ordersData.getMyOrders(firebase.auth().currentUser.uid)
      .then(orders => this.setState({ orders }))
      .catch(err => console.error('didnt get orders', err));
  }

  componentDidMount() {
    fishData.getFishes()
      .then(fishes => this.setState({ fishes }))
      .catch(err => console.error('could not get fishes', err));

    this.getOrders();
  }

  deleteOrder = (orderId) => {
    ordersData.deleteOrder(orderId)
      .then(() => this.getOrders())
      .catch(err => console.error('did not delete', err));
  }

  addFishToOrder = (fishId) => {
    const fishOrderCopy = { ...this.state.fishOrder };
    fishOrderCopy[fishId] = fishOrderCopy[fishId] + 1 || 1; // why do we use bracket notation?
    this.setState({ fishOrder: fishOrderCopy });
  }

  removeFromOrder = (fishId) => {
    const fishOrderCopy = { ...this.state.fishorder };
    delete fishOrderCopy[fishId];
    this.setState({ fishOrder: fishOrderCopy });
  }

  makeNew = (orderName) => {
    const newOrder = { fishes: { ...this.state.fishOrder }, name: orderName };
    newOrder.dateTime = Date.now();
    newOrder.uid = firebase.auth().currentUser.uid;
    ordersData.postOrders(newOrder)
      .then(() => {
        this.setState({ fishorder: {} });
        this.getOrders();
      })
      .catch(err => console.error('didnt post order', err));
  }

  updateExisting = (orderName) => {
    const updateOrder = { ...this.state.orderEditing };
    const orderId = updateOrder.id;
    updateOrder.fishes = this.state.fishOrder;
    updateOrder.name = orderName;
    delete updateOrder.id;
    ordersData.putOrder(orderId, updateOrder)
      .then(() => {
        this.setState({ fishOrder: {}, orderEditing: {} });
        this.getOrders();
      })
      .catch(err => console.error('didnt update order', err));
  }

  saveNewOrder = (orderName) => {
    if (Object.keys(this.state.orderEditing).length > 0) {
      this.updateExisting(orderName);
    } else {
      this.makeNew(orderName);
    }
  }

  selectOrderToEdit = (orderId) => {
    const selectedOrder = this.state.orders.find(order => order.id === orderId);
    this.setState({ fishOrder: selectedOrder.fishes, orderEditing: selectedOrder });
  }

  render() {
    const {
      fishes,
      orders,
      fishOrder,
      orderEditing,
    } = this.state;

    return (
      <div className="Home">
        <div className="row">
          <div className="col">
            <Inventory fishes={fishes} addFishToOrder={this.addFishToOrder}/>
          </div>
          <div className="col">
            <NewOrder
              fishes={fishes}
              fishOrder={fishOrder}
              removeFromOrder={this.removeFromOrder}
              saveNewOrder={this.saveNewOrder}
              orderEditing={orderEditing}
            />
          </div>
          <div className="col">
            <Orders
              orders={orders}
              deleteOrder={this.deleteOrder}
              selectOrderToEdit={this.selectOrderToEdit}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
