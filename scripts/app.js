$(function() {
  var Todo = Backbone.Model.extend({});
  var TodoList = Backbone.PageableCollection.extend({
    model: Todo,
    url: "api/todos",
    state: {
      pageSize: 15
    },
    mode: "client" // page entirely on the client side
  });

  var todoList = new TodoList();

  // Define columns
  var columns = [{
      name: "text",
      label: "Task",
      // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
      cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
    }, {
      name: "dueDate",
      label: "Due On",
      cell: "string" // An integer cell is a number cell that displays humanized integers
    }, {
      name: "priority",
      label: "Priority",
      cell: "string" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
    }];


  // Set up a grid to use the pageable collection
  var pageableGrid = new Backgrid.Grid({
    columns: [{
      // enable the select-all extension
      name: "",
      cell: "select-row",
      headerCell: "select-all"
    }].concat(columns),
    collection: todoList
  });

  // Render the grid
  var $todoGrid = $("#todo-grid");
  $todoGrid.append(pageableGrid.render().el)

  // Initialize the paginator
  var paginator = new Backgrid.Extension.Paginator({
    collection: todoList
  });

  // Render the paginator
  $todoGrid.after(paginator.render().el);

  // Initialize a client-side filter to filter on the client
  // mode pageable collection's cache.
  var filter = new Backgrid.Extension.ClientSideFilter({
    collection: todoList,
    fields: ['text']
  });

  // Render the filter
  $todoGrid.before(filter.render().el);

  // Add some space to the filter and move it to the right
  $(filter.el).css({float: "right", margin: "20px"});

  // Fetch some data
  todoList.fetch({reset: true});

});
