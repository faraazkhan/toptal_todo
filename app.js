$(function() {
  var Territory = Backbone.Model.extend({});

  var Territories = Backbone.Collection.extend({
    model: Territory,
    url: "examples/territories.json"
  });

  var territories = new Territories();
  var PageableTerritories = Backbone.PageableCollection.extend({
    model: Territory,
    url: "examples/pageable-territories.json",
    state: {
      pageSize: 15
    },
    mode: "client" // page entirely on the client side
  });

  var pageableTerritories = new PageableTerritories();

  // Define columns
  var columns = [{
      name: "id", // The key of the model attribute
      label: "ID", // The name to display in the header
      editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
      // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
      cell: Backgrid.IntegerCell.extend({
        orderSeparator: ''
      })
    }, {
      name: "name",
      label: "Name",
      // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
      cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
    }, {
      name: "pop",
      label: "Population",
      cell: "integer" // An integer cell is a number cell that displays humanized integers
    }, {
      name: "percentage",
      label: "% of World Population",
      cell: "number" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
    }, {
      name: "date",
      label: "Date",
      cell: "date"
    }, {
      name: "url",
      label: "URL",
      cell: "uri" // Renders the value in an HTML anchor element
  }];


  // Set up a grid to use the pageable collection
  var pageableGrid = new Backgrid.Grid({
    columns: [{
      // enable the select-all extension
      name: "",
      cell: "select-row",
      headerCell: "select-all"
    }].concat(columns),
    collection: pageableTerritories
  });

  // Render the grid
  var $example2 = $("#example-2-result");
  $example2.append(pageableGrid.render().el)

  // Initialize the paginator
  var paginator = new Backgrid.Extension.Paginator({
    collection: pageableTerritories
  });

  // Render the paginator
  $example2.after(paginator.render().el);

  // Initialize a client-side filter to filter on the client
  // mode pageable collection's cache.
  var filter = new Backgrid.Extension.ClientSideFilter({
    collection: pageableTerritories,
    fields: ['name']
  });

  // Render the filter
  $example2.before(filter.render().el);

  // Add some space to the filter and move it to the right
  $(filter.el).css({float: "right", margin: "20px"});

  // Fetch some data
  pageableTerritories.fetch({reset: true});

});
