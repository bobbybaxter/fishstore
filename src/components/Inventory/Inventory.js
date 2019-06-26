import React from 'react';

import './Inventory.scss';

import fishData from '../../helpers/data/fishData';

class Inventory extends React.Component {
  state = {
    fishes: [],
  }

  componentDidMount() {
    fishData.getFishes()
      .then(fishes => this.setState({ fishes }))
      .catch(err => console.error('could not get fishes', err));
  }

  render() {
    return (
      <div className="Inventory">
        <h1>Inventory</h1>
      </div>
    );
  }
}

export default Inventory;
