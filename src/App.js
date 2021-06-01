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


 getCarsFromRestAPI(){
    //1-Clear array
    var aux = [];
    var aux2 = [];
    //Save the cars on the list
    var option = this.state.search;
    option = option.toLocaleLowerCase();
    {CarInfo.cars.map(car => 
      {
        aux2.push(car.brand)
        if(car.brand.toLocaleLowerCase().includes(option) || car.model.toLocaleLowerCase().includes(option) ){
          aux.push(car)
        }
      } 
    )}
    this.setState({cars : aux, search : '', brandOptions : aux2});
  }

  componentWillMount(){
    this.getCarsFromRestAPI();
  }

  onClickSearch(event){
    event.preventDefault();
    this.getCarsFromRestAPI();
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
        list.push(<Car key ={this.state.cars[i].id}
          carName={this.state.cars[i].brand}
          carModel={this.state.cars[i].model}
          carDesc={this.state.cars[i].otherInfo}
          carImageUrl={this.state.cars[i].imgUrl}
          carPrice={this.state.cars[i].price}
          carColors={this.state.cars[i].colors}/>)
      }

      //Brands for search options
      var brands = this.state.brandOptions.map(b => ({
        "value" : b,
        "label" : b
      }))
      
      //Colors for search options
      var colors = ["Red", "Black", "White", "Yellow"]
      const colorOptions = colors.map(c => ({
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