
//ParentController

var CrudCtrl = function ($scope,$filter) {

  	
	$scope.newElement = {};

  	$scope.edit = function(row,model)
	{
		console.log(row);		
		model.update(row).then((response)=>{
			if(response.data.status == 1)
			{
				alert("Editado");
			}
			else{
				if(response.data.message != null)
				{	
					alert(response.data.message);
				}
				if(response.data.desc != null)
				{	
					alert(response.data.desc);
				}
			}	
		}).catch((error)=>{
			alert("Sucedio un error");
		});
				
	}
	
	$scope.delete = function(row,model)
	{	
		model.delete(row,self.tableParams).then((response)=>{
			
			if(response.data.status == 1)
			{
				let index = model.rows.indexOf(row);
				object.rows.splice(index, 1);
				alert("eliminado");				
				$scope.dataTable.reload();				
			}
			if(response.data.status == 2)
			{
				alert(response.data.message);
			}		

		}).catch((error)=>{
			alert("Sucedio un error");
		});
	}
	
	$scope.create = function(row,model)
	{
		console.log(row);
		if(isEmpty(row))
		{
			return alert("No puede crear datos con valores vacios");
		}
		else
		{
			model.create(row,$scope.copycat,self.tableParams).then((response)=>{
				if(response.data.status == 1)
				{
					alert("creado");
					$scope.dataTable.reload();
					$scope.newElement = {}; 			
				}
				else{
					if(response.data.message != null)
					{	
						alert(response.data.message);
					}
					if(response.data.desc != null)
					{	
						alert(response.data.desc);
					}
				}
			}).catch((error)=>{
				alert("Sucedio un error");
			});
		}
	}

	
	$scope.column_behavior = function(col,element)
	{	

		//console.log("this was exec");
		//console.log(col.Key);	
		if(col.Key != "")
		{
			return false;
		}

		return true;
		
	}

	$scope.verifyColumnwithProperty = function(header)
	{
		let verify = false;


		if(VETOED_COLUMNS)
	  	{
		  	VETOED_COLUMNS.indexOf(header.Field) !== -1  ?   verify = true  :  verify = false;
		}

			
		return !verify;
	}

	//Verfica si las llaves foraneas falsas son validas

	$scope.evaluate_false_foreigners = function(col,falseforeigns)
	{
		//console.log("evaluate");
		
		let current = false;

		if(falseforeigns != null)
		{
			falseforeigns.forEach(function(element){
				if(col.Field == element.local_key)
				{
					current = element;
				}	
			});	
		}	
		
		//console.log(current);

		return current;	
	}

	//Creo un arreglo dinamico para editar campos

	$scope.dynamicArray = function(name){   	
		if($scope[name] != null)
		{
			return $scope[name].rows;	
		}
    	
	}

	//Verifica si debe mostrar la columna 

	$scope.get_column_by_reference = function(header,model=false){

		
		let column;

		if(model)
		{
			
			column = $filter('filter')(model.columns,{Field:header.Field})[0];
			
			if(column == null)
			{
				 column = $filter('filter')(model.headers,{Field:header.Field})[0];
				// Si no esta en las columnas de la base de datos, entonces va a estar en los headers ya que estas columnas fuerón posteriormente creadas como objetos json		
			}		

			//console.log(column);
		}
		else
		{
			
			//Verifica si hay un modelo global en el estado
			column = $filter('filter')($scope.currentModel.columns,{Field:header.Field})[0];

			
			if(column == null)
			{
				 column = $filter('filter')($scope.currentModel.headers,{Field:header.Field})[0];
				// Si no esta en las columnas de la base de datos, entonces va a estar en los headers ya que estas columnas fuerón posteriormente creadas como objetos json		
			}		

				
		}

		
		return column;		
		
	}


	$scope.foreign_value = function(key_data,f_id){
	
		var filter_object = {};
		filter_object[key_data.REFERENCED_COLUMN_NAME] = f_id;
		var foreign_data = $filter('filter')($scope[key_data.REFERENCED_TABLE_NAME.capitalize()].rows,filter_object)[0];		
		return foreign_data[$scope[key_data.REFERENCED_TABLE_NAME.capitalize()].default];
	}


	$scope.dynamicSelectArray = function(name){
	
		$scope.key_value =  $scope[name.capitalize()].default;
    	return $scope[name.capitalize()].rows;
	}

	$scope.validateInput = function(col)
	{
		console.log(col);
	}
	
    $scope.isWorking = "yes abastract Crud is Working";
}


//Parent Service

var CrudServ = function ($http) {
 	
  return {

  	testIn: function(){
  		return alert("hello testIn");
  	},    
    get_from_table: function(query){
    	let formData = new FormData();		
		formData.append('Acc', 'get_from_table');
		formData.append('query', query);
		return $http({
			url: GET_FROM_TABLE_END_POINT,
			method: "POST",
			data: formData,
			headers: { 
			  'Content-Type': undefined
			}
	   });
    },
    persist: function(data){
    	return $http.put(PERSIST_END_POINT,data);
    },
    delete: function(){
    	return $http({
			url: DELETE_END_POINT,
			method: "DELETE",
			data: data,
			headers: { 
			  'Content-Type': 'json'
			}
	   });
    },
    create: function(data){
    	return $http.post(CREATE_END_POINT,data);
    },
    getAll: function(data){
    	let formData = new FormData();		
		formData.append('Acc', 'getAll');
		formData.append('table', data.table);
		return $http({
			url: GET_ALL_END_POINT,
			method: "POST",
			data: formData,
			headers: { 
			  'Content-Type': undefined
			}
	   });
    },
    getBy: function(get){
    	let data = {};
		data.properties = get.get;
		data.Acc = 'getBy';
		data.table = get.table;
		return $http.post(GET_BY_END_POINT,data);
    },
    getMETA_COLUMNS: function(data){
    	let formData = new FormData();		
		formData.append('Acc', 'META_COLUMNS');
		formData.append('table', data.table);
		return $http({
			url: GET_META_COLUMNS_END_POINT,
			method: "POST",
			data: formData,
			headers: { 
			  'Content-Type': undefined
			}
	   });
    },
    foreign_data:function(column,table)
	{
		var formData = new FormData();		
		formData.append('Acc', 'foreign_data');
		formData.append('column', column);
		formData.append('table', table);
		return $http({
			url: GET_META_COLUMNS_END_POINT,
			method: "POST",
			data: formData,
			headers: { 
			  'Content-Type': undefined
			}
	   });	   

	}


  };
};