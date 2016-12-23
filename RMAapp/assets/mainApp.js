  var rma = '';
  var company= '';
$(function() {

  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '300px' });
  client.invoke('ticketFields:custom_field_47366887.disable'); // disable RMA CREATED checkbox
  client.invoke('ticketFields:custom_field_47406007.disable');
  client.invoke('ticketFields:custom_field_47935227.disable');
  initializeRMA(client); //current status is not editable 

  showForm(null);
  client.get(['ticket.requester.email',
  			'ticket.customField:custom_field_46855868', //Company
			'ticket.customField:custom_field_46932007', //attention
			'ticket.customField:custom_field_46855888', //add1
			'ticket.customField:custom_field_46932027', //add2
			'ticket.customField:custom_field_46856748', //email
			'ticket.customField:custom_field_46858188', //phone
			'ticket.customField:custom_field_46858548', //city
			'ticket.customField:custom_field_46933827',//state
			'ticket.customField:custom_field_47000528', //zipcode
			'ticket.customField:custom_field_46934007',//country 
			'ticket.customField:custom_field_47366887' // RMA already created?
			]).then(function(data){
	getShopifyData(data,client);
	  initializeRMAfields(client);

  });
    $("#get-btn").click(function(event) {
	    event.preventDefault();
	    client.get(['ticket.id','ticket.customField:custom_field_46860008']).then(function(data) {
	    	getRMAstatus(data,client);
	    });
	});

	$("#ship-btn").click(function(event) {
	    event.preventDefault();
	    client.get(['ticket.id','ticket.customField:custom_field_46860008',
	    			'ticket.customField:custom_field_46929407', // shipping carrier
					'ticket.customField:custom_field_46855688', // shipping service
					'ticket.customField:custom_field_46855868', //Company
					'ticket.customField:custom_field_46932007', //attention
					'ticket.customField:custom_field_46855888', //add1
					'ticket.customField:custom_field_46932027', //add2
					'ticket.customField:custom_field_46856748', //email
					'ticket.customField:custom_field_46858188', //phone
					'ticket.customField:custom_field_46858548', //city
					'ticket.customField:custom_field_46933827',//state
					'ticket.customField:custom_field_47000528', //zipcode
					'ticket.customField:custom_field_46934007', //country
					'ticketFields:custom_field_46855688.options', //shipping method options
					'ticket.customField:custom_field_47967607',// product 1
					'ticket.customField:custom_field_47000708', // quantity 1
					'ticket.customField:custom_field_48855488', //sb
					'ticket.customField:custom_field_48855128', //Product 2
					'ticket.customField:custom_field_47067847', //Quantity 2
					'ticket.customField:custom_field_48855508', //SN2
					'ticket.customField:custom_field_48855428', //Product 3
					'ticket.customField:custom_field_47001008', //Quantity 3
					'ticket.customField:custom_field_48855528',		//sn3			
					'ticket.customField:custom_field_48855448', //Product 4
					'ticket.customField:custom_field_47068187', //Quantity 4
					'ticket.customField:custom_field_48855548',		//sn4			
					'ticket.customField:custom_field_48855468', //Product 5
					'ticket.customField:custom_field_47068207', //Quantity 5
					'ticket.customField:custom_field_48855568',			//sn5	
					]).then(function(data) {
	    				client.invoke('instances.create', {location: 'modal', url: 'assets/modalframe.html', testtkt :'thistest'}).then(function(modalContext) {
	    					localStorage.setItem('mRma', data['ticket.customField:custom_field_46860008']);
	    					localStorage.setItem('mCarrier', data['ticket.customField:custom_field_46929407']);
	    					localStorage.setItem('mService', data['ticket.customField:custom_field_46855688']);
	    					localStorage.setItem('mCompany', data['ticket.customField:custom_field_46855868']);
	    					localStorage.setItem('mAttention', data['ticket.customField:custom_field_46932007']);
	    					localStorage.setItem('mAdd1', data['ticket.customField:custom_field_46855888']);
	    					localStorage.setItem('mAdd2', data['ticket.customField:custom_field_46932027']);
	    					localStorage.setItem('mEmail', data['ticket.customField:custom_field_46856748']);
	    					localStorage.setItem('mPhone', data['ticket.customField:custom_field_46858188']);
	    					localStorage.setItem('mCity', data['ticket.customField:custom_field_46858548']);
	    					localStorage.setItem('mState', data['ticket.customField:custom_field_46933827']);
	    					localStorage.setItem('mZip', data['ticket.customField:custom_field_47000528']);
	    					localStorage.setItem('mCountry', data['ticket.customField:custom_field_46934007']);
	    					var optionsStr = prepareShipOpts(data['ticketFields:custom_field_46855688.options']);
	    					localStorage.setItem('mOptions', optionsStr);
	    					localStorage.setItem('mItem1', data['ticket.customField:custom_field_47967607']);
	    					localStorage.setItem('mQty1', data['ticket.customField:custom_field_47000708']);
	    					var pr1 = data['ticket.customField:custom_field_47967607'];
					  		var qty1 = data['ticket.customField:custom_field_47000708'];
					  		var pr2 = data['ticket.customField:custom_field_48855128'];
					  		var qty2 = data['ticket.customField:custom_field_47067847'];
					  		var pr3 = data['ticket.customField:custom_field_48855428'];
					  		var qty3 = data['ticket.customField:custom_field_47001008'];
					  		var pr4 = data['ticket.customField:custom_field_48855448'];
					  		var qty4 = data['ticket.customField:custom_field_47068187'];
					  		var pr5 = data['ticket.customField:custom_field_48855468'];
					  		var qty5 = data['ticket.customField:custom_field_47068207 '];
					   		var sn1 = data['ticket.customField:custom_field_48855488'];
  							var sn2 = data['ticket.customField:custom_field_48855508'];
					  		var sn3 = data['ticket.customField:custom_field_48855528'];
					  		var sn4 = data['ticket.customField:custom_field_48855548'];
					  		var sn5 = data['ticket.customField:custom_field_48855568'];
					  		var rmaItems = getRMAItems(pr1,qty1,sn1,pr2,qty2,sn2,pr3,qty3,sn3,pr4,qty4,sn4,pr5,qty5,sn5); 
					  		localStorage.setItem('mItems', JSON.stringify(rmaItems));

					        // The modal is on the screen now!
  							var modalClient = client.instance(modalContext['instances.create'][0].instanceGuid);
  							modalClient.on('modal.close', function() {
    						// The modal has been closed.
    							var modalResponse = localStorage.getItem('mResponse') || '';
    							client.set('ticket.customField:custom_field_47935227',modalResponse);    																	    
			          		 });
        				});
	    });
	});
  
    $("#add-btn").click(function(event) {
	    event.preventDefault();
	    client.get(	['ticket.customField:custom_field_46860008', // RMA NUMBER
					'ticket.customField:custom_field_46859388', //RMA TYPE
					'ticket.customField:custom_field_46859408', //DISPOSITION TYPE
					'ticket.customField:custom_field_46929407', // shipping carrier
					'ticket.customField:custom_field_46855688', // shipping service
					'ticket.customField:custom_field_46855868', //Company
					'ticket.customField:custom_field_46932007', //attention
					'ticket.customField:custom_field_46855888', //add1
					'ticket.customField:custom_field_46932027', //add2
					'ticket.customField:custom_field_46856748', //email
					'ticket.customField:custom_field_46858188', //phone
					'ticket.customField:custom_field_46858548', //city
					'ticket.customField:custom_field_46933827',//state
					'ticket.customField:custom_field_47000528', //zipcode
					'ticket.customField:custom_field_46934007', //country
					'ticket.customField:custom_field_46934027', //generaate_return_label
					'ticket.customField:custom_field_46858888', //return weight
					'ticket.customField:custom_field_47967607', //Product
					'ticket.customField:custom_field_47000708', //quantity
					'ticket.customField:custom_field_48855488', //sb
					'ticket.customField:custom_field_48855128', //Product 2
					'ticket.customField:custom_field_47067847', //Quantity 2
					'ticket.customField:custom_field_48855508', //SN2
					'ticket.customField:custom_field_48855428', //Product 3
					'ticket.customField:custom_field_47001008', //Quantity 3
					'ticket.customField:custom_field_48855528',		//sn3			
					'ticket.customField:custom_field_48855448', //Product 4
					'ticket.customField:custom_field_47068187', //Quantity 4
					'ticket.customField:custom_field_48855548',		//sn4			
					'ticket.customField:custom_field_48855468', //Product 5
					'ticket.customField:custom_field_47068207', //Quantity 5
					'ticket.customField:custom_field_48855568',			//sn5		
					'ticketFields:custom_field_46855688.options',
	    			 'ticket.requester.name','ticket.id','ticket.customField:custom_field_47366887']).then(function(data) {

  		var vrma_number = data['ticket.customField:custom_field_46860008'];
  		var d = new Date();
  		var vrma_date = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  		var vrma_type = data['ticket.customField:custom_field_46859388'];
  		var vdisposition = data['ticket.customField:custom_field_46859408'];
  		var vcarrier = data['ticket.customField:custom_field_46929407'];
  		var vmethod= getShipMethod(data['ticketFields:custom_field_46855688.options'],data['ticket.customField:custom_field_46855688']);
  		var vcompany = data['ticket.customField:custom_field_46855868'];
  		var vattention = data['ticket.customField:custom_field_46932007'];
  		var vadd1 = data['ticket.customField:custom_field_46855888'];
  		var vadd2 = data['ticket.customField:custom_field_46932027'];
  		var vemail = data['ticket.customField:custom_field_46856748'];
  		var vphone = data['ticket.customField:custom_field_46858188'];
  		var vcity = data['ticket.customField:custom_field_46858548'];
  		var vstate = data['ticket.customField:custom_field_46933827'];
  		var vzipcode = data['ticket.customField:custom_field_47000528'];
  		var vcountry = data['ticket.customField:custom_field_46934007'];
  		var vgen_rl = data['ticket.customField:custom_field_46934027'];
  		var vweight = data['ticket.customField:custom_field_46858888'];
  		var pr1 = data['ticket.customField:custom_field_47967607'];
  		var qty1 = data['ticket.customField:custom_field_47000708'];
  		var pr2 = data['ticket.customField:custom_field_48855128'];
  		var qty2 = data['ticket.customField:custom_field_47067847'];
  		var pr3 = data['ticket.customField:custom_field_48855428'];
  		var qty3 = data['ticket.customField:custom_field_47001008'];
  		var pr4 = data['ticket.customField:custom_field_48855448'];
  		var qty4 = data['ticket.customField:custom_field_47068187'];
  		var pr5 = data['ticket.customField:custom_field_48855468'];
  		var qty5 = data['ticket.customField:custom_field_47068207 '];
  		var sn1 = data['ticket.customField:custom_field_48855488'];
  		var sn2 = data['ticket.customField:custom_field_48855508'];
  		var sn3 = data['ticket.customField:custom_field_48855528'];
  		var sn4 = data['ticket.customField:custom_field_48855548'];
  		var sn5 = data['ticket.customField:custom_field_48855568'];

  	    if (vrma_date.length == 0) {
	      client.invoke('notify', 'RMA date can\'t be blank.', 'error');
	    } 
	    else if (vrma_type.length == 0) {
	      client.invoke('notify', 'RMA Type can\'t be blank.', 'error');
	    }
	    else if (vdisposition== null || vdisposition.length == 0) {
	      client.invoke('notify', 'RMA Disposition Type can\'t be blank.', 'error');
	    }
	    else if (vcarrier.length == 0) {
	      client.invoke('notify', 'Shipping Carrier can\'t be blank.', 'error');
	    }
	    else if (vmethod.length == 0) {
	      client.invoke('notify', 'Shipping Method can\'t be blank.', 'error');
	    }
	    else if (vattention.length == 0) {
	      client.invoke('notify', 'Attention to can\'t be blank.', 'error');
	    }
	    else if (vadd1.length == 0) {
	      client.invoke('notify', 'Address1 can\'t be blank.', 'error');
	    }
	    else if (vemail.length == 0) {
	      client.invoke('notify', 'Email can\'t be blank.', 'error');
	    }
	    else if (vcity.length == 0) {
	      client.invoke('notify', 'City can\'t be blank.', 'error');
	    }
	    else if (vstate.length == 0) {
	      client.invoke('notify', 'State can\'t be blank.', 'error');
	    }
	    else if (vzipcode.length == 0) {
	      client.invoke('notify', 'ZipCode can\'t be blank.', 'error');
	    }
	    else if (vcountry.length == 0) {
	      client.invoke('notify', 'Country can\'t be blank.', 'error');
	    }	    
	    else if (vgen_rl.length == 'yes' && (vweight == null || vweight == '')) {
	      client.invoke('notify', 'If you wish to generate a return label you must enter the total weight for the order.', 'error');
	    }
	    else if (pr1.length == 0) {
	      client.invoke('notify', 'You must add at least one product for RMA (Product)', 'error');
	    }
	    else if (qty1.length == 0 || qty1 == 0) {
	      client.invoke('notify', 'You must set up the quantity of the Product to be returned.', 'error');
	    }
	   	else if (pr1 == 'lilycam001-1' && sn1.length == 0) {
	      client.invoke('notify', 'You must add the Serial Number for Product 1', 'error');
	    }
   	    else if (pr2 == 'lilycam001-2' && sn2.length == 0) {
	      client.invoke('notify', 'You must add the Serial Number for Product 2', 'error');
	    }
   	    else if (pr3 == 'lilycam001-3' && sn3.length == 0) {
	      client.invoke('notify', 'You must add the Serial Number for Product 3', 'error');
	    }
   	    else if (pr4 == 'lilycam001-4' && sn4.length == 0) {
	      client.invoke('notify', 'You must add the Serial Number for Product 4', 'error');
	    }
   	    else if (pr5 == 'lilycam001-5' && sn5.length == 0) {
	      client.invoke('notify', 'You must add the Serial Number for Product 5', 'error');
	    }
	    else { 
	    	var rmaItems = getRMAItems(pr1,qty1,sn1,pr2,qty2,sn2,pr3,qty3,sn3,pr4,qty4,sn4,pr5,qty5,sn5);   
	    	if (vgen_rl == 'yes') {
	    		vgen_rl = true;
				var task = {
				  rma_number: vrma_number  ,
				  rma_date: vrma_date, 
				  shipping_carrier: vcarrier, 
				  shipping_service: vmethod, 
				  shipping_address:{
					  company: vcompany,
					  attention: vattention,
					  address1: vadd1,
					  address2: vadd2,
					  email: vemail,
					  phone: vphone,
					  city: vcity,
					  state_province: vstate,
					  postal_code: vzipcode,
					  country_code: vcountry
				  },
				  validate_address: false,
				  total_amount: 0.0, // totalAmount 
				  rma_type: vrma_type,
				  disposition : vdisposition,
				  generate_return_service_label : vgen_rl,
				  return_weight_lb : vweight,
				  lines:rmaItems
				};
	    	}else{
				var task = {
				  rma_number: vrma_number,
				  rma_date: vrma_date, 
				  shipping_carrier: vcarrier, 
				  shipping_service: vmethod, 
				  shipping_address:{
					  company: vcompany,
					  attention: vattention,
					  address1: vadd1,
					  address2: vadd2,
					  email: vemail,
					  phone: vphone,
					  city: vcity,
					  state_province: vstate,
					  postal_code: vzipcode,
					  country_code: vcountry
				  },
				  validate_address: false,
				  total_amount: 0.0, // totalAmount 
				  rma_type: vrma_type,
				  disposition : vdisposition,
				  lines:rmaItems
				};
			}
			console.log(JSON.stringify(task));
			var upTicket={"ticket": {
				"status":"open",
				"custom_fields": [
					{"id": 46860008, "value":vrma_number },
					{"id": 46929407, "value":vcarrier },
					{"id": 46855688, "value":vmethod },
					{"id": 46855868, "value":vcompany },
					{"id": 46932007, "value":vattention },
					{"id": 46855888, "value":vadd1 },
					{"id": 46932027, "value":vadd2 },
					{"id": 46856748, "value":vemail },
					{"id": 46858188, "value":vphone },
					{"id": 46858548, "value":vcity },
					{"id": 46933827, "value":vstate },
					{"id": 47000528, "value":vzipcode },
					{"id": 46934007, "value":vcountry },
					{"id": 46859388, "value":vrma_type },
					{"id": 46859408, "value":vdisposition },
					{"id": 46934027, "value":vgen_rl },
					{"id": 46858888, "value":vweight },
					{"id": 47000688, "value":pr1},
					{"id": 47000708, "value":qty1 },
					{"id": 47067827, "value":pr2 },
					{"id": 47067847, "value":qty2 },
					{"id": 47067867, "value":pr3 },
					{"id": 47001008, "value":qty3 },
					{"id": 47068167, "value":pr4 },
					{"id": 47068187, "value":qty4 },
					{"id": 47001028, "value":pr5 },
					{"id": 47068207, "value":qty5 },
					{"id": 47406007, "value":vdisposition }
					]
				}
			};
			sendTaskData(task, data['ticket.id'],upTicket, client);
	    }
		});
  	});
  
});

function initializeRMA(client){
	client.get('ticket.id').then(function(data) {
  		rma= 'RMA-'+data['ticket.id'].toString();
  		client.set('ticket.customField:custom_field_46860008',rma);
  	});
}

function updateTicket(tid,d,client){
 
  	var settings = {
    url: '/api/v2/tickets/'+tid+'.json',
    //headers: {"Authorization": "Basic ZGVtODA4OmRjbGRlbUA4"}, the demo credentials..
    //headers: {"Authorization": "Basic bHljODAxOk1vdGlvbkAx"}, 
    type: 'PUT',
    dataType: 'json',
    data:d
  };
    client.request(settings).then(
    function(response) {
    	client.invoke('notify', 'Ticket updated.');
   	},
    function(response) {
      var msg = 'Error :' + JSON.stringify(response);
      client.invoke('notify', msg, 'error');
    }
  );
}

function getShipMethod(options,val){
	for ( var i in options) {
		if(options[i].value == val){
			return options[i].label;
		}
	}
}
function initializeRMAfields(client){
  client.get(['ticket.id','ticket.assignee','ticket.customField:custom_field_47366887']).then(function(data) {
  		if(data['ticket.customField:custom_field_47366887']=='yes'){
  			$("#add-btn").hide();
  			$("#get-btn").show();
  			$("#ship-btn").show();
			client.invoke('ticketFields:custom_field_46859388.disable'); //RMA TYPE
			client.invoke('ticketFields:custom_field_46859408.disable'); //DISPOSITION TYPE
			client.invoke('ticketFields:custom_field_46929407.disable'); // shipping carrier
			client.invoke('ticketFields:custom_field_46855688.disable'); // shipping service
			client.invoke('ticketFields:custom_field_46855868.disable'); //Company
			client.invoke('ticketFields:custom_field_46932007.disable'); //attention
			client.invoke('ticketFields:custom_field_46855888.disable'); //add1
			client.invoke('ticketFields:custom_field_46932027.disable'); //add2
			client.invoke('ticketFields:custom_field_46856748.disable'); //email
			client.invoke('ticketFields:custom_field_46858188.disable'); //phone
			client.invoke('ticketFields:custom_field_46858548.disable'); //city
			client.invoke('ticketFields:custom_field_46933827.disable'); //state
			client.invoke('ticketFields:custom_field_47000528.disable'); //zipcode
			client.invoke('ticketFields:custom_field_46934007.disable'); //country
			client.invoke('ticketFields:custom_field_46934027.disable'); //generaate_return_label
			client.invoke('ticketFields:custom_field_46858888.disable'); //return weight
			//ITEMS 
			client.invoke('ticketFields:custom_field_47967607.disable'); //Product
			client.invoke('ticketFields:custom_field_47000708.disable'); //quantity
			client.invoke('ticketFields:custom_field_48855128.disable'); //Product 2
			client.invoke('ticketFields:custom_field_47067847.disable'); //Quantity 2
			client.invoke('ticketFields:custom_field_48855428.disable'); //Product 3
			client.invoke('ticketFields:custom_field_47001008.disable'); //Quantity 3
			client.invoke('ticketFields:custom_field_48855448.disable'); //Product 4
			client.invoke('ticketFields:custom_field_47068187.disable'); //Quantity 4
			client.invoke('ticketFields:custom_field_48855468.disable'); //Product 5
			client.invoke('ticketFields:custom_field_47068207.disable'); //Quantity 5

			client.invoke('ticketFields:custom_field_48855488.disable'); //sn1
	  		client.invoke('ticketFields:custom_field_48855508.disable');//sn2
	  		client.invoke('ticketFields:custom_field_48855528.disable');//s3
	  		client.invoke('ticketFields:custom_field_48855548.disable');//sn4
	  		client.invoke('ticketFields:custom_field_48855568.disable');//sn5

  		}else{
  			$("#add-btn").show();
  			$("#get-btn").hide();
  			$("#ship-btn").hide();
  		}
  		client.set('ticket.customField:custom_field_46835388','yes'); //show rma fields
 		handleRMAfields(client);
	});

  //the following fields whould not be edited manually by agents.
  client.invoke('ticketFields:custom_field_46860008.disable'); //RMA NUMBER
  client.invoke('ticketFields:custom_field_46858908.disable'); //return label URL
  client.invoke('ticketFields:custom_field_46859208.disable'); //return label tracking number

  client.on('ticket.custom_field_46835388.changed', function() { // show or hide RMA fields
  		handleRMAfields(client);
  });

}

function handleRMAfields(client){
	client.get('ticket.customField:custom_field_46835388').then(function(value) {
  		if(value['ticket.customField:custom_field_46835388'] == 'yes'){
  			
			client.invoke('ticketFields:custom_field_46859388.show'); //RMA TYPE
			client.invoke('ticketFields:custom_field_46859408.show'); //DISPOSITION TYPE
			client.invoke('ticketFields:custom_field_46929407.show'); // shipping carrier
			client.invoke('ticketFields:custom_field_46855688.show'); // shipping service
			client.invoke('ticketFields:custom_field_46855868.show'); //Company
			client.invoke('ticketFields:custom_field_46932007.show'); //attention
			client.invoke('ticketFields:custom_field_46855888.show'); //add1
			client.invoke('ticketFields:custom_field_46932027.show'); //add2
			client.invoke('ticketFields:custom_field_46856748.show'); //email
			client.invoke('ticketFields:custom_field_46858188.show'); //phone
			client.invoke('ticketFields:custom_field_46858548.show'); //city
			client.invoke('ticketFields:custom_field_46933827.show'); //state
			client.invoke('ticketFields:custom_field_47000528.show'); //zipcode
			client.invoke('ticketFields:custom_field_46934007.show'); //country
			client.invoke('ticketFields:custom_field_46934027.show'); //generaate_return_label
			client.invoke('ticketFields:custom_field_46858888.show'); //return weight
			//ITEMS 
			client.invoke('ticketFields:custom_field_47967607.show'); //Product
			client.invoke('ticketFields:custom_field_47000708.show'); //quantity
			client.invoke('ticketFields:custom_field_48855128.show'); //Product 2
			client.invoke('ticketFields:custom_field_47067847.show'); //Quantity 2
			client.invoke('ticketFields:custom_field_48855428.show'); //Product 3
			client.invoke('ticketFields:custom_field_47001008.show'); //Quantity 3
			client.invoke('ticketFields:custom_field_48855448.show'); //Product 4
			client.invoke('ticketFields:custom_field_47068187.show'); //Quantity 4
			client.invoke('ticketFields:custom_field_48855468.show'); //Product 5
			client.invoke('ticketFields:custom_field_47068207.show'); //Quantity 5
			client.invoke('ticketFields:custom_field_48855488.show'); //sn1
	  		client.invoke('ticketFields:custom_field_48855508.show');//sn2
	  		client.invoke('ticketFields:custom_field_48855528.show');//s3
	  		client.invoke('ticketFields:custom_field_48855548.show');//sn4
	  		client.invoke('ticketFields:custom_field_48855568.show');//sn5

			client.invoke('ticketFields:custom_field_46858908.show'); //return label URL
			client.invoke('ticketFields:custom_field_46859208.show'); //return label tracking number
			client.invoke('ticketFields:custom_field_46860008.show'); //RMA NUMBER
  		}else{
			client.invoke('ticketFields:custom_field_46859388.hide'); //RMA TYPE
			client.invoke('ticketFields:custom_field_46859408.hide'); //DISPOSITION TYPE
			client.invoke('ticketFields:custom_field_46929407.hide'); // shipping carrier
			client.invoke('ticketFields:custom_field_46855688.hide'); // shipping service
			client.invoke('ticketFields:custom_field_46855868.hide'); //Company
			client.invoke('ticketFields:custom_field_46932007.hide'); //attention
			client.invoke('ticketFields:custom_field_46855888.hide'); //add1
			client.invoke('ticketFields:custom_field_46932027.hide'); //add2
			client.invoke('ticketFields:custom_field_46856748.hide'); //email
			client.invoke('ticketFields:custom_field_46858188.hide'); //phone
			client.invoke('ticketFields:custom_field_46858548.hide'); //city
			client.invoke('ticketFields:custom_field_46933827.hide'); //state
			client.invoke('ticketFields:custom_field_47000528.hide'); //zipcode
			client.invoke('ticketFields:custom_field_46934007.hide'); //country
			client.invoke('ticketFields:custom_field_46934027.hide'); //generaate_return_label
			client.invoke('ticketFields:custom_field_46858888.hide'); //return weight

			client.invoke('ticketFields:custom_field_46858908.hide'); //return label URL
			client.invoke('ticketFields:custom_field_46859208.hide'); //return label tracking number
			client.invoke('ticketFields:custom_field_46860008.hide'); //RMA NUMBER
			//ITEMS 
			client.invoke('ticketFields:custom_field_47967607.hide'); //Product
			client.invoke('ticketFields:custom_field_47000708.hide'); //quantity
			client.invoke('ticketFields:custom_field_48855128.hide'); //Product 2
			client.invoke('ticketFields:custom_field_47067847.hide'); //Quantity 2
			client.invoke('ticketFields:custom_field_48855428.hide'); //Product 3
			client.invoke('ticketFields:custom_field_47001008.hide'); //Quantity 3
			client.invoke('ticketFields:custom_field_48855448.hide'); //Product 4
			client.invoke('ticketFields:custom_field_47068187.hide'); //Quantity 4
			client.invoke('ticketFields:custom_field_48855468.hide'); //Product 5
			client.invoke('ticketFields:custom_field_47068207.hide'); //Quantity 5
			client.invoke('ticketFields:custom_field_48855488.hide'); //sn1
	  		client.invoke('ticketFields:custom_field_48855508.hide');//sn2
	  		client.invoke('ticketFields:custom_field_48855528.hide');//s3
	  		client.invoke('ticketFields:custom_field_48855548.hide');//sn4
	  		client.invoke('ticketFields:custom_field_48855568.hide');//sn5
  		}
	});
}

function getRMAItems(pr1,qty1,sn1,pr2,qty2,sn2,pr3,qty3,sn3,pr4,qty4,sn4,pr5,qty5,sn5){
	var items = new Array();
	items.push({item_number:pr1.slice(0, -2), quantity:qty1, serial_number:sn1});
	if(isValid(pr2) && isValid(qty2)){
		items.push({item_number:pr2.slice(0, -2), quantity:qty2, serial_number:sn2});
	}
	if(isValid(pr3) && isValid(qty3)){
		items.push({item_number:pr3.slice(0, -2), quantity:qty3, serial_number:sn3});
	}
	if(isValid(pr4) && isValid(qty4)){
		items.push({item_number:pr4.slice(0, -2), quantity:qty4, serial_number:sn4});
	}
	if(isValid(pr5) && isValid(qty5)){
		items.push({item_number:pr5.slice(0, -2), quantity:qty5, serial_number:sn5});
	}
	return items;
}

function isValid(field){
 if (field != null && field != ''){
 	return true;
 }else{
 	return false;
 }
}

function showForm(data) {
  var source = $("#main-hdbs").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#content").html(html);
}

function showSuccess(data) {
  var source = $("#success-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#content").html(html);
}

function showRMAData(data) {
  var source = $("#rma-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#content").html(html);
}

function showError(data) {
  var source = $("#error-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#content").html(html);
}

function sendTaskData(task, ticketid, upTicket, client) {
	
  var settings = {
    url: 'https://api.dclcorp.com/api/v1/rmas',
    //headers: {"Authorization": "Basic ZGVtODA4OmRjbGRlbUA4"}, the demo credentials..
    headers: {"Authorization": "Basic bHljODAxOk1vdGlvbkAx"}, 
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(task)
  };
  client.request(settings).then(
    function(response) {
      	client.invoke('notify', 'RMA successfully added to DCL');
      	client.set('ticket.customField:custom_field_47366887','yes');
		client.invoke('ticketFields:custom_field_46859388.disable'); //RMA TYPE
		client.invoke('ticketFields:custom_field_46859408.disable'); //DISPOSITION TYPE
		client.invoke('ticketFields:custom_field_46929407.disable'); // shipping carrier
		client.invoke('ticketFields:custom_field_46855688.disable'); // shipping service
		client.invoke('ticketFields:custom_field_46855868.disable'); //Company
		client.invoke('ticketFields:custom_field_46932007.disable'); //attention
		client.invoke('ticketFields:custom_field_46855888.disable'); //add1
		client.invoke('ticketFields:custom_field_46932027.disable'); //add2
		client.invoke('ticketFields:custom_field_46856748.disable'); //email
		client.invoke('ticketFields:custom_field_46858188.disable'); //phone
		client.invoke('ticketFields:custom_field_46858548.disable'); //city
		client.invoke('ticketFields:custom_field_46933827.disable'); //state
		client.invoke('ticketFields:custom_field_47000528.disable'); //zipcode
		client.invoke('ticketFields:custom_field_46934007.disable'); //country
		client.invoke('ticketFields:custom_field_46934027.disable'); //generaate_return_label
		client.invoke('ticketFields:custom_field_46858888.disable'); //return weight
		//ITEMS 
		client.invoke('ticketFields:custom_field_47967607.disable'); //Product
		client.invoke('ticketFields:custom_field_47000708.disable'); //quantity
		client.invoke('ticketFields:custom_field_48855128.disable'); //Product 2
		client.invoke('ticketFields:custom_field_47067847.disable'); //Quantity 2
		client.invoke('ticketFields:custom_field_48855428.disable'); //Product 3
		client.invoke('ticketFields:custom_field_47001008.disable'); //Quantity 3
		client.invoke('ticketFields:custom_field_48855448.disable'); //Product 4
		client.invoke('ticketFields:custom_field_47068187.disable'); //Quantity 4
		client.invoke('ticketFields:custom_field_48855468.disable'); //Product 5
		client.invoke('ticketFields:custom_field_47068207.disable'); //Quantity 5
					client.invoke('ticketFields:custom_field_48855488.disable'); //sn1
	  		client.invoke('ticketFields:custom_field_48855508.disable');//sn2
	  		client.invoke('ticketFields:custom_field_48855528.disable');//s3
	  		client.invoke('ticketFields:custom_field_48855548.disable');//sn4
	  		client.invoke('ticketFields:custom_field_48855568.disable');//sn5

		client.set('ticket.customField:custom_field_46858908',response['return_label_url']);
		client.set('ticket.customField:custom_field_46859208',response['return_label_tracking_number']);

		client.invoke('ticketFields:custom_field_46858908.disable'); //return label URL
		client.invoke('ticketFields:custom_field_46859208.disable'); //return label tracking number
		client.invoke('ticketFields:custom_field_46860008.disable'); //RMA NUMBER

		upTicket.ticket.custom_fields.push({"id": 47366887, "value":"yes" });
		upTicket.ticket.custom_fields.push({"id": 46858908, "value":response['return_label_url'] });
		upTicket.ticket.custom_fields.push({"id": 46859208, "value":response['return_label_tracking_number'] });
		updateTicket(ticketid,upTicket,client);
		initializeRMAfields(client);
		$("#get-btn").show();
		$("#ship-btn").show();
		$("#add-btn").hide();
	  showSuccess(response);
	  $("#get-btn").show();
		$("#ship-btn").show();
		$("#add-btn").hide();
    },
    function(response) {
      	var msg = 'Error Code:' +  response.responseJSON.error_code + ' Msg:' + response.responseJSON.error_message;
      	client.invoke('notify', msg, 'error');
      	console.err(response);
		upTicket.ticket.custom_fields.push({"id": 47366887, "value":"no" });
		updateTicket(ticketid,upTicket,client);
		initializeRMAfields(client);
		$("#get-btn").hide();
		$("#ship-btn").hide();
		$("#add-btn").show();
	  	showError(response.responseJSON);
    }
  );
}

function getRMAstatus(data,client){
	var ticketid= data['ticket.id'];
	var rmas= new Array();
	rmas.push(data['ticket.customField:custom_field_46860008']);
	var rurl= 'https://api.dclcorp.com/api/v1/rmas?rma_numbers='+rmas;
  var settings = {
    url: rurl,
    headers: {"Authorization": "Basic bHljODAxOk1vdGlvbkAx"}, 
    type: 'GET',
    contentType: 'application/json'
  };
    client.request(settings).then(
    function(response) {
    	var disp = "";
		switch (response['rmas']['0']['disposition']) {
		  case 1:
		    disp = " Await Decision";
		    break;
		  case 2:
		    disp = " Return To Stock";
		    break;
		  case 3:
		    disp = " Scrap";
		    break;
		  case 5:
		    disp = " Rework";
		    break;
		  case 10:
		    disp = " Test";
		    break;
		  case 18:
		    disp = " Return To Vendor";
		    break;
		  default: 
		    disp = " Unknown: " + response['rmas']['0']['disposition'];
		}

    	client.set('ticket.customField:custom_field_47406007',disp);
    	var upTicket={"ticket": {"status":"open", "custom_fields": [{"id": 47406007, "value":disp }]}};
    	updateTicket(ticketid,upTicket,client);
    	var respRMA= response['rmas']['0'];
    	respRMA.desc=disp;
    	showRMAData(respRMA);
   	},
    function(response) {
      var msg = 'Error Code:' +  response.responseJSON.error_code + ' Msg:' + response.responseJSON.error_message;
      client.invoke('notify', msg, 'error');
      console.err(response);
	  showError(response.responseJSON);
    }
  );
}

function getShopifyData(fields,client){
		var settings = {
		url: 'https://lily-robotics.myshopify.com/admin/customers/search.json?query='+fields['ticket.requester.email'],
		headers  : {'Authorization': 'Basic ZTdkMjkwMjZlMmRiMGIxMjMwZmZiODE2MDJiMTVkOGM6Y2Y5Y2U2ZWE3MDBjNTUxOGQ1YWJjNTk3MWYxZDgwMzk'},
		type:'GET',
		contentType: 'application/json'
		};
		client.request(settings).then(
			function(data) {
				if(!isValid(fields['ticket.customField:custom_field_46855868'])){client.set('ticket.customField:custom_field_46855868',data['customers']['0']['default_address']['company']); }//company}
				
				if(!isValid(fields['ticket.customField:custom_field_46932007'])){client.set('ticket.customField:custom_field_46932007',data['customers']['0']['default_address']['name']); }//attention}
					
				if(!isValid(fields['ticket.customField:custom_field_46855888'])){client.set('ticket.customField:custom_field_46855888',data['customers']['0']['default_address']['address1']); }//add1}
					
				if(!isValid(fields['ticket.customField:custom_field_46932027'])){client.set('ticket.customField:custom_field_46932027',data['customers']['0']['default_address']['address2']); }//add2}
					
				if(!isValid(fields['ticket.customField:custom_field_46856748'])){client.set('ticket.customField:custom_field_46856748',data['customers']['0']['email']); }//mail}
					
				if(!isValid(fields['ticket.customField:custom_field_46858188'])){client.set('ticket.customField:custom_field_46858188',data['customers']['0']['default_address']['phone']); }//phone}
					
				if(!isValid(fields['ticket.customField:custom_field_46858548'])){client.set('ticket.customField:custom_field_46858548',data['customers']['0']['default_address']['city']); }//city}
					
				if(!isValid(fields['ticket.customField:custom_field_46933827'])){client.set('ticket.customField:custom_field_46933827',data['customers']['0']['default_address']['province_code']); }//state}
					
				if(!isValid(fields['ticket.customField:custom_field_47000528'])){client.set('ticket.customField:custom_field_47000528',data['customers']['0']['default_address']['zip']); }//zipcode}
					
				if(!isValid(fields['ticket.customField:custom_field_46934007'])){client.set('ticket.customField:custom_field_46934007',data['customers']['0']['default_address']['country_code']); }//country}
				
				var last_sho_id = data['customers']['0']['last_order_id'];
				if (isValid(last_sho_id)){
					getShopifyOrderData(last_sho_id,client);
				}else{
					showForm(null);
				}
				client.invoke('notify', 'Shopify data recovered.');
			},
			function(response) {
				console.err('Error at: function getShopifyData');
				console.err(response);
				showForm(null);
			}
		);
}

function prepareShipOpts(opts){
    var response = '';
    for( var i in opts){
      response += '<option value="'+opts[i].label+'">'+opts[i].label+'</option>'
    }
    return response;
}

function getShopifyOrderData(last_sho_id,client){
	var myURL = 'https://lily-robotics.myshopify.com/admin/orders.json?ids='+last_sho_id;
	var settings = {
		url: myURL,
		headers  : {'Authorization': 'Basic ZTdkMjkwMjZlMmRiMGIxMjMwZmZiODE2MDJiMTVkOGM6Y2Y5Y2U2ZWE3MDBjNTUxOGQ1YWJjNTk3MWYxZDgwMzk'},
		type:'GET',
		contentType: 'application/json'
	};
	client.request(settings).then(
		function(data) {		
			var items = data['orders']['0']['line_items'];
			var notes = data['orders']['0']['note_attributes'];
			var noteList = '';
			for (var z in notes){
				noteList += notes[z].name + ': '+notes[z].value.replace(/\s+/g, '-') +'\n';
			}
			var itemsList = '';
			for ( var i in items) {
				itemsList += items[i].sku + ' Qty:'+items[i].quantity +'\n';
			}
			var result = { 
							"id":data['orders']['0']['id'],
							"name":data['orders']['0']['name'],
							"line_items":itemsList,
							"email":data['orders']['0']['email'],
							"first_name":data['orders']['0']['customer']['first_name'],
							"last_name":data['orders']['0']['customer']['last_name'],
							"notes":noteList
						};
			showForm(result);
			initializeRMAfields(client);
		},
		function(response) {
			console.err('Error at: function getShopifyOrderData');
			console.err(response);
			showForm(null);
		}
	);
}
