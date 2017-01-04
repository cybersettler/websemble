function AppController( view, scope ){

  // Controller constructor is called when an instance
  // of the html element is created

  // Controllers are stateless, the model is used to
  // store state data instead.

  // This class extends component/view/AbstractController
  // so we need to call the super contructor
  this.super( view, scope );
}

module.exports = AppController;
