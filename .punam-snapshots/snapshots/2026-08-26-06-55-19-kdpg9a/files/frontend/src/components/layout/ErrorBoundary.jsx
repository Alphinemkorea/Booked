import { Component } from 'react';
export class ErrorBoundary extends Component {
  constructor(p){super(p);this.state={error:null}}
  static getDerivedStateFromError(e){return{error:e}}
  render(){if(this.state.error)return <div style={{padding:48,textAlign:'center'}}><h1>Something went wrong</h1><button type="button" className="btn btn-primary" onClick={()=>this.setState({error:null})}>Try again</button></div>;return this.props.children}
}
