import logo from './logo.svg';
import './App.css';
import Car from './Car'
import CarInfo from './CarsInfo.json'
import Select from 'react-select';


import * as  React from 'react';

class App extends React.Component {

  constructor(){
      super();
      this.state = {cars : [],
        search : '',
        colorSearch : '',
        colorsAvailable : [],
        brandOptions : []};

        this.onClickSearch = this.onClickSearch.bind(this);
  }

  /**
  * Fetch cars from REST API
  */
  async getCars(){

   var link = 'https://f4vltvpeve.execute-api.us-east-1.amazonaws.com/dev/listcars/'
    if(this.state.search !== '' && this.state.colorSearch !== ''){
      link = 'https://f4vltvpeve.execute-api.us-east-1.amazonaws.com/dev/cars?Color='+this.state.colorSearch+'&Model='+this.state.search
    }
    const response = await fetch(link);
    const data = await response.json();
    if(data==null)
      return
      
    //1-Clear array
    var aux = [];
    var aux2 = [];
    var colorsList = []
    
    {data.map(car => 
      {
        if(this.state.search == ''){
          aux2.push(car.model)
          if(!colorsList.includes(car.colors))
            colorsList.push(car.colors)
        }
        aux.push(car)
      } 
    )}
    if(this.state.search == '')
      this.setState({cars : aux, search : '', colorSearch : '', brandOptions : aux2, colorsAvailable : colorsList});
    else
    this.setState({cars : aux, search : '', colorSearch : ''});
  }



/**
 * Fetch cars from localfile
 * Don't use this function. Only for initial tests.
 */
 getCarsFromRestAPI(){
    //1-Clear array
    var aux = [];
    var aux2 = [];
    //Save the cars on the list
    var option = this.state.search;
    option = option.toLocaleLowerCase();
    {CarInfo.cars.map(car => 
      {
        aux2.push(car.model)
        if(car.brand.toLocaleLowerCase().includes(option) || car.model.toLocaleLowerCase().includes(option) ){
          aux.push(car)
        }
      } 
    )}
    this.setState({cars : aux, search : '', brandOptions : aux2});
  }

  componentWillMount(){
    //this.getCarsFromRestAPI();
    this.getCars();
  }

  onClickSearch(event){
    event.preventDefault();
    //this.getCarsFromRestAPI();
    this.getCars();
  }

  handleChangeBrand(e){
    this.setState({search : e.label})
  }

  handleChangeColor(e){
    this.setState({colorSearch : e.label})
  }

  render(){

      var list = []
      for(var i=0; i< this.state.cars.length; i++){
        list.push(<Car key ={this.state.cars[i].ID}
          carName={this.state.cars[i].brand}
          carModel={this.state.cars[i].model}
          carDesc={this.state.cars[i].otherInfo}
          carImageUrl={this.state.cars[i].imgUrl}
          carPrice={this.state.cars[i].price}
          carColors={this.state.cars[i].colors}
          id={this.state.cars[i].ID}
          />)
      }

      // Brands for search options
      var brands = this.state.brandOptions.map(b => ({
        "value" : b,
        "label" : b
      }))
      
      // Colors for search options
      const colorOptions = this.state.colorsAvailable.map(c => ({
        "value" : c,
        "label" : c
      }))


      return (
        <div className="App">
        <h1>Car Seller</h1>

        <div className="search-elements">
        <Select className="search-model" placeholder="Car Model ..." options={brands} onChange={this.handleChangeBrand.bind(this)}/>
        <Select className="search-color" placeholder="Car Color ..." options={colorOptions} onChange={this.handleChangeColor.bind(this)}/>
        <form className="form-search" onSubmit={this.onClickSearch}>
          <button className="search-button" type="submit">Search</button>
        </form> 
        </div>
        
        <div className="cars-list">
          {list}
        </div>
      </div>
      )
  }

}

export {App}