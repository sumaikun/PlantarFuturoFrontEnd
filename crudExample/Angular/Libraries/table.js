function table(table,resource,headers,get_by="All")
{
	var resulset = null;

	this.debug_mode = false;
	
	this.table = table;	
	
	//The service to connect to db
	this.resource = resource;
	
	this.headers = headers;	
	
	this.ready = this.init(get_by);

	this.id_column = "id";
	
	this.test = function()
	{
		this.resource.test(this);
	}
	
}

table.prototype.create = function(row,copy){	

	let last;

	this.rows ?  (()=>{

		last = this.rows[this.rows.length - 1]	
	
		console.log(last);

		console.log(this.id_column);
	
		row[this.id_column] = (parseInt(last[this.id_column])+parseInt(1)).toString();


	})() : (()=>{

		console.log(this.id_column);

		this.rows = [];

		row[this.id_column] = 1;

	})() ;	
	

	console.log(row);	
	
	copy = angular.copy(row);
	
	this.rows.push(copy);
	
	copy = {};
	
	this.data = row;
	
	return this.resource.create(this);
   
};

table.prototype.update = function(row){
   this.data = JSON.stringify(row, function (key, val) {
		 if (key == '$$hashKey') {
		   return undefined;
		 }
		 return val;
	});

	this.data = angular.fromJson(this.data);		
	return this.resource.persist(this);
	
};

table.prototype.delete = function(row)
{	
	if(confirm("¿Esta seguro de realizar este proceso?"))
	{ 	
		this.data = angular.fromJson(row);	
		return this.resource.delete(this);
		
		
	}		
};

		

table.prototype.init = function(get_by)
{
	//console.log(object);
	let self = this;
	let asyncprocess = new Promise( (resolve, reject) => {


		let request;

		if(get_by == "All")
		{ 		
			request = self.resource.getAll(self);		
		}
		else
		{
			//console.log("get_by");
			request = self.resource.getBy({get:get_by,table:self.table});	
		}
		

		request.then(function(response){
			 self.rows = response.data.rows;			 		 			
		});
		request2 = self.resource.getMETA_COLUMNS(self);
	    request2.then(function(response){

	    	let column_promises = [];	
		 	
		 	self.columns = response.data.columns;
		 	self.columns.forEach(function(element) {
		 	  
		 	  //Add features for ng-table

		 	  if(element.Key == "PRI")
		 	  {
		 	  	self.id_column = element.Field;
		 	  }

		 	  /*
		 	  if(element.Key.includes("MUL"))
			  {
			  		
			  		let request3 = self.resource.foreign_data(element.Field,self.table);
			  		column_promises.push(request3);
			  		request3.then(function(response){			  			
			  			element.key_data = response.data.f_data[0];
			  		});
			  }*/


		 	  //Traducción de columna por configuración
		 	  if(COLUMNS_TRANSLATIONS)
		 	  {
		 	  	COLUMNS_TRANSLATIONS.keys.indexOf(element.Field) !== -1  ?  element.title = COLUMNS_TRANSLATIONS.translations[element.Field]   : element.title = element.Field ;	 	  	
		 	  	

		 	  }
		 	  
		 	  element.field = element.Field;
		 	  element.sortable = element.Field;
		 	  let filter_obj = {};	 	  
			  
		 	  let filter_type = "";

			  if(element.Type.includes("varchar")||element.Type.includes("text"))
			  {
			  	filter_type = "text";
			  }
			  else
			  {
			  	filter_type = "number";
			  }

		 	  filter_obj[element.field] = filter_type; 	 	  
		 	  element.filter= filter_obj;
			  //console.log(element);


			  //Columnas vetadas de aparecer
			  if(VETOED_COLUMNS)
			  {
			  	VETOED_COLUMNS.indexOf(element.field) !== -1  ?  element.show = false   : false;
			  }	

			});

			self.columns.push({title:"Opciones",Field:"Opciones"});	

			self.headers ? self.headers : self.headers = self.columns;

			  if(column_promises.length > 0)
			  {
			  	 Promise.all(column_promises).then(values => {		  	   
					resolve("¡loaded!");	   			  
				  });
			  }
			  else
			  {
			  	resolve("¡loaded!");
			  }
			
	   });
	});
	return asyncprocess;   		
}

/*table.prototype.init = function(get_by)
{
	//El get by es para poder filtrar la empresa por usuario
	
	let self = this;

		let asyncprocess = new Promise( (resolve, reject) => {

			if(get_by == "All")
			{ 		
				let request = self.resource.getAll(self);		
 			}
 			else
			{
				//console.log("get_by");
				let request = self.resource.getBy({get:get_by,table:self.table});	
			}

			request.then(function(response){
				 self.rows = response.data.rows;
				 let request2 = self.resource.getMETA_COLUMNS(self);
			
					//self.loaded.push(request2);
					let column_promises = [];		
				    
				    request2.then(function(response){

					 	self.columns = response.data.columns;
					 	self.columns.forEach(function(element,idx){			 					 	

				    	if(element.Type.includes("varchar") && self.default == null)
					  	{
					  		 self.default = element.Field;			  	
					  	}
					  	if(element.Key.includes("PRI"))
					  	{
					  		 self.primary_key = element.Field;			  	
					  	}
					  	if(element.Key.includes("MUL"))
					  	{
					  		
					  		let request3 = self.resource.foreign_data(element.Field,self.table);
					  		column_promises.push(request3);
					  		request3.then(function(response){			  			
					  			element.key_data = response.data.f_data[0];
					  		});
					  	}

					  	 //Traducción de columna por configuración
					 	  if(COLUMNS_TRANSLATIONS)
					 	  {
					 	  	COLUMNS_TRANSLATIONS.keys.indexOf(element.Field) !== -1  ?  element.title = COLUMNS_TRANSLATIONS.translations[element.Field]   : element.title = element.Field ;		 	  	

					 	  }

					 	  //Columnas vetadas de aparecer
						  if(VETOED_COLUMNS)
						  {
						  	VETOED_COLUMNS.indexOf(element.field) !== -1  ?  element.show = false   : false;
						  }	


					  });

					  self.columns.push({title:"Opciones",Field:"Opciones"});	

					  self.headers ? self.headers : self.headers = self.columns; 

					  if(column_promises.length > 0)
					  {
					  	 Promise.all(column_promises).then(values => {		  	   
							resolve("¡loaded!");	   			  
						  });
					  }
					  else
					  {
					  	resolve("¡loaded!");
					  }
			   });
			});			
		});
	//self.loaded.push(asyncprocess);

	return asyncprocess;

}*/


function isEmpty(obj) {
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

