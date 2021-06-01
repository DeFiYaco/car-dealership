import * as  React from 'react';
import style from './car.module.css';
import Select from 'react-select';
import Popup from './Popup'

class Car extends React.Component {

  constructor(props){
      super();
      this.state = {carName : ' ', carDesc : ' ' , carImageUrl : '',
       carModel : '', carPrice : '', carColors : [],
       colorSelected : '',
       isOpen : false};

      this.state.carName = props.carName;
      this.state.carModel = props.carModel;
      this.state.carDesc = props.carDesc;
      this.state.carImageUrl = props.carImageUrl;
      this.state.carPrice = props.carPrice;
      this.state.carColors = props.carColors;

      this.onBuy = this.onBuy.bind(this);
      this.togglePopup = this.togglePopup.bind(this);
  }


  onBuy(event){
    event.preventDefault();
    this.setState({isOpen : !this.state.isOpen})
  }

  handleChange(e){
    this.setState({colorSelected : e.label});
  }

  togglePopup(event){
    this.setState({isOpen : !this.state.isOpen})
  }


  render(){

    const colorOptions = this.state.carColors.map(color => ({
      "value" : color,
      "label" : color
    }))

      var colors = [];
      for(var i=0; i<this.state.carColors.length; i++){
        colors.push(<option key={this.state.carColors[i]+this.state.carName} value={this.state.carColors[i]}>{this.state.carColors[i]}</option>)
      }

      return (
        <div className={style.car}>

            <h1>{this.state.carName + " " + this.state.carModel}</h1>
            <p>{this.state.carDesc}</p>
            <img src={this.state.carImageUrl} alt="" className={style.image} />

            <Select className={style.colorOpt} placeholder="Select Color"  options={colorOptions} onChange={this.handleChange.bind(this)}/>
            <div>
              <form onSubmit={this.onBuy}> 
                <p>Price: {this.state.carPrice} € </p>
                <button className={style.select_buy_button} type="submit"> Buy </button>
              </form>
            </div> 

            {this.state.isOpen && <Popup
              content={<>
                <h2>Place the order</h2>
                <div>
                  <b>Car Information: </b>
                  <br/>
                  {"Model: " + this.state.carName}
                  <br/>
                  {"Brand: " + this.state.carModel}
                  <br/>
                  {"Price: " + this.state.carPrice + " €"}
                  
                </div>
                <div>
                  <form>
                    <label>Name: </label>
                    <input></input>
                    <br/>
                    <label>Email: </label>
                    <input></input>
                    <br/>
                    <label>Adress: </label>
                    <input></input>
                    <br/>
                    <button className={style.select_confirm_button} type="submit"> Confirm Order </button>
                  </form>
                </div>
              </>}
              handleClose={this.togglePopup}
            />}

        </div>
      )
  }

}

export default Car