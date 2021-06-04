import * as  React from 'react';
import style from './car.module.css';
import Popup from './Popup';
import * as emailjs from "emailjs-com";

class Car extends React.Component {

  constructor(props){
      super();
      this.state = {carName : ' ', carDesc : ' ' , carImageUrl : '',
       carModel : '', carPrice : '', carColors : '', id: '',
       colorSelected : '',
       isOpen : false,
       clientName : '',
       clientEmail : '',
       clientAdress : '',
       vinNumber : '',
       licencePlate : ''};

      this.state.carName = props.carName;
      this.state.carModel = props.carModel;
      this.state.carDesc = props.carDesc;
      this.state.carImageUrl = props.carImageUrl;
      this.state.carPrice = props.carPrice;
      this.state.carColors = props.carColors;
      this.state.id = props.id;

      this.onBuy = this.onBuy.bind(this);
      this.togglePopup = this.togglePopup.bind(this);
      this.onClickConfirmOrder = this.onClickConfirmOrder.bind(this);
      this.onChangeClientName = this.onChangeClientName.bind(this);
      this.onChangeClientEmail = this.onChangeClientEmail.bind(this);
      this.onChangeClientAdress = this.onChangeClientAdress.bind(this);
      
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


  onChangeClientName(event){
    this.setState({clientName : event.target.value})
  }

  onChangeClientEmail(event){
    this.setState({clientEmail : event.target.value})
  }

  onChangeClientAdress(event){
    this.setState({clientAdress : event.target.value})
  }


  onClickConfirmOrder(event){
    if(this.state.clientName == '' || this.state.clientEmail == '' || this.state.clientAdress == '')
      return;

    // Send order confimation email
    this.sendOrderConfirmationEmail();

    this.orderCar();
  }


  async orderCar(){
    // Reserve Car and get VIN number 
    var link = 'https://f4vltvpeve.execute-api.us-east-1.amazonaws.com/dev/vin?Color='+ this.state.carColors +'&Model='+ this.state.carModel
    const response = await fetch(link);
    const data = await response.json();
    this.setState({vinNumber : data});
    //console.log('Getting VIN number:  ' + data);

    // Send VIN number in order to get a licence plate
    var link = 'https://iqtovnhiy3.execute-api.us-east-1.amazonaws.com/prod?vin=' + this.state.vinNumber
    const response1 = await fetch(link, {
      method: 'POST',
    });
    //console.log('Sending VIN number: ' + this.state.vinNumber);

    // Get licence plate 
    var link = 'https://iqtovnhiy3.execute-api.us-east-1.amazonaws.com/prod?vin=' + this.state.vinNumber;
    const response2 = await fetch(link);
    const data2 = await response2.json();
    this.setState({licencePlate : data2.licensePlate})
    console.log('Getting licence plate' + data2.licensePlate);

    let confLinkToCostumer = 'https://17emo3rvm8.execute-api.us-east-1.amazonaws.com/prod/confirm?vin=' + this.state.vinNumber
    let qrCodeURL = 'http://api.qrserver.com/v1/create-qr-code/?data=' + confLinkToCostumer + '&size=400x400'

    // Save Order Data into the database
    var link = 'https://17emo3rvm8.execute-api.us-east-1.amazonaws.com/prod/registerorder?vin=' + this.state.vinNumber +
    '&licence_plate=' + this.state.licencePlate +
     '&ca=' + this.state.clientAdress +
      '&cm=' + this.state.clientEmail +
       '&cn=' + this.state.clientName +
        '&qr=' + qrCodeURL;
   const response3 = await fetch(link);
  // console.log('Registering Order');

   // Send an email with Order Confirmation ID
   this.sendOrderDetails();

   this.setState({clientName : "", clientEmail : "", clientAdress : "", isOpen : !this.state.isOpen})
  }



  /**
   * Send Order confirmation email to the client
   */
  sendOrderConfirmationEmail(){
    var data = {
      to_email : this.state.clientEmail,
      to_name : this.state.clientName,
      message : "Car: " + this.state.carName + ' ' + this.state.carModel,
    };

    emailjs.send('service_ES_cars', 'order_conf_template', data, 'user_xQswXKFreeOGIVejwz9wH').then(
      function (response) {
        console.log(response.status, response.text);
      },
      function (err) {
        console.log(err);
      }
    );
  }


  /**
   * Send Order details with with the car VIN, plate number and confirmation QR code
   */
  sendOrderDetails(){

    //Get QR_Code url
    //let qrCodeURL = document.getElementById(this.state.carColors+this.state.carModel)
     // .toDataURL("image/png");
    let confLinkToCostumer = 'https://17emo3rvm8.execute-api.us-east-1.amazonaws.com/prod/confirm?vin=' + this.state.vinNumber
    let qrCodeURL = 'http://api.qrserver.com/v1/create-qr-code/?data=' + confLinkToCostumer + '&size=400x400'

    console.log(this.state.clientEmail)
    var data = {
      to_email : this.state.clientEmail,
      to_name : this.state.clientName,
      car_name : "Car Model: " + this.state.carName + ' ' + this.state.carModel,
      car_licence_plate : "Licence Plate: " + this.state.licencePlate,
      car_vin : "VIN Number: " + this.state.vinNumber,
      qr_code: qrCodeURL
    };

    emailjs.send('service_ES_cars', 'order_details', data, 'user_xQswXKFreeOGIVejwz9wH').then(
      function (response) {
        console.log(response.status, response.text);
      },
      function (err) {
        console.log(err);
      }
    );
  }


  render(){
      return (
        <div className={style.car}>

            <h1>{this.state.carName + " " + this.state.carModel}</h1>
            <p>{this.state.carDesc}</p>
            <img src={this.state.carImageUrl} alt="" className={style.image} />

            
            <div>
              <form onSubmit={this.onBuy}> 
                <p>Price: {this.state.carPrice} € </p>
                <p>Color: {this.state.carColors}</p>
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
                  {"Color: " + this.state.carColors}
                  <br/>
                  {"Price: " + this.state.carPrice + " €"}
                  
                </div>
                <div>

                  <label>Name: </label>
                    <input className={style.formField} onChange={this.onChangeClientName}></input>
                    <br/>
                    <label>Email: </label>
                    <input className={style.formField} onChange={this.onChangeClientEmail}></input>
                    <br/>
                    <label>Adress: </label>
                    <input className={style.formField} onChange={this.onChangeClientAdress}></input>
                    <br/>
                    <button className={style.select_confirm_button} onClick={this.onClickConfirmOrder} type="submit"> Confirm Order </button>
                </div>
              </>}
             handleClose={this.togglePopup}
            />}


        </div>
      )
  }

}

export default Car