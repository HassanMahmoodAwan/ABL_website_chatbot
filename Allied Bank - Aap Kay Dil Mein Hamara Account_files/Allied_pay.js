jQuery(window).on('load',function(){window.loaded=true;localStorage.removeItem("authorization_token");localStorage.removeItem("token_type");localStorage.removeItem("Allied_payForm_result");var currentUrl=window.location.href;var makeURL=window.location.protocol+
"//"+
window.location.host+
window.location.pathname+
"?consumernumber="+
" ";if(currentUrl!==makeURL){var getCleanUrl=function(url){return url.replace(/#.*$/,"").replace(/\?.*$/,"");};var finalURL=getCleanUrl(makeURL);if(currentUrl===finalURL){window.history.replaceState({},"",currentUrl);}else{window.history.replaceState({path:makeURL},"",makeURL);}}});jQuery(document).ready(function(){var authApiRespons;var additionalFieldData={};var filterAdditionalFieldData={};var additinalKeyValues;var labelID;var labelValue;var checkboxLable;var labelDetail={};var objKeys;var splitKeys;var splitKeysMore;var splitValue;var exactKeys={};function getAuthToken(){try{var settings={url:"https://api.abl.com/abl-api/thirdpartyapis/oauth2/token",method:"POST",timeout:0,headers:{"Content-Type":"application/x-www-form-urlencoded",},data:{grant_type:"client_credentials",client_id:"e41b627e-7de8-4062-992c-c9eeab10f15d",client_secret:"T7jR5pS2aB3uF2sU7tG8eT2gI7mM0vG0nA0jQ4lF4hB0pC3kC6",scope:"ABLApis",},};$.ajax(settings).done(function(response){authApiRespons=response;if(authApiRespons){localStorage.setItem("authorization_token",authApiRespons.access_token);localStorage.setItem("token_type",authApiRespons.token_type);}});}catch(e){console.log(e);}}
getAuthToken();async function billingPayForm(payReq,apiAuthToken,exactKeys){var postURL="https://api.abl.com/abl-api/thirdpartyapis/BillsImportAPI/BillingApi";var obj=JSON.stringify(payReq);try{fetch(postURL,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer"+" "+apiAuthToken,"x-ibm-client-id":"e41b627e-7de8-4062-992c-c9eeab10f15d",},body:obj,}).then((response)=>response.json()).then((result)=>{console.log(result);if(result){if(result.responseCode==="00"&&result.consumerNumber!==""){localStorage.setItem("Allied_payForm_result",JSON.stringify(result));var payForm_obj=JSON.parse(localStorage.getItem("Allied_payForm_result"));var consumer=payForm_obj.consumerNumber;if(payForm_obj){var makeURL=window.location.protocol+
"//"+
window.location.host+
window.location.pathname+
"?consumernumber="+
consumer;window.history.replaceState({path:makeURL},"",makeURL);console.log("makeURL--->",makeURL);if(makeURL){var queryString=window.location.search;var urlParams=new URLSearchParams(queryString);var consNumber=urlParams.get("consumernumber");console.log("consumer num is:",consNumber);if(consNumber){setTimeout(function(){jQuery("#print-alliedpay td.refNum").text(consNumber);jQuery("#print-alliedpay .alliedpay-additional-feilds");console.log("filterAdditionalFieldData",filterAdditionalFieldData);console.log("exactKeys",exactKeys);if(exactKeys){var getkeys;var getValues;for(var[key,value]of Object.entries(exactKeys)){getkeys=`${key}`;jQuery("#print-alliedpay .alliedpay-additional-feilds > tbody").each(function(){jQuery(this).append('<tr><td class="key">'+getkeys+"</td></tr>");});}
for(var[key,value]of Object.entries(filterAdditionalFieldData)){getValues=`${value}`;jQuery("#print-alliedpay .alliedpay-additional-feilds-values > tbody").each(function(){jQuery(this).append('<tr><td class="value">'+
getValues+
"</td></tr>");});}}
jQuery("#print-alliedpay #msg").show();jQuery("#print-alliedpay #msg").text("Your request has been processed, Please Pay this reference "+
consNumber+
" through ABL Branch Network, myabl, ABL ATM, or 1Bill Option");jQuery("#print-alliedpay #counter-msg").hide();},5000);}}}}}
if((result.responseCode==="01")&&(result.consumerNumber==="")){localStorage.setItem("Allied_payForm_rejection",JSON.stringify(result));var obj=JSON.parse(localStorage.getItem("Allied_payForm_rejection"));var rejectError=obj.responseMessage;if(rejectError){var makeURL=window.location.protocol+
"//"+
window.location.host+
window.location.pathname+
"?rejectionError="+
rejectError;window.history.replaceState({path:makeURL},"",makeURL);console.log("makeURL--->",makeURL);if(makeURL){var queryString=window.location.search;var urlParams=new URLSearchParams(queryString);var errorMsg=urlParams.get("rejectionError");console.log("rejectError num is:",errorMsg);if(errorMsg){setTimeout(function(){jQuery('#print-alliedpay #counter-msg').show();jQuery('#print-alliedpay #counter-msg').text("Your request failed, please try again!");jQuery('#print-alliedpay #msg').hide();},4000);}}}}
if((result.httpCode==="500")&&(result.consumerNumber==="")){localStorage.setItem("Allied_payForm_server_error",JSON.stringify(result));var serverObj=JSON.parse(localStorage.getItem("Allied_payForm_server_error"));var serverError=serverObj.httpMessage;if(serverError){var makeURL=window.location.protocol+
"//"+
window.location.host+
window.location.pathname+
"?serverInternalError="+
serverError;window.history.replaceState({path:makeURL},"",makeURL);console.log("makeURL--->",makeURL);if(makeURL){var queryString=window.location.search;var urlParams=new URLSearchParams(queryString);var serverErrorMsg=urlParams.get("serverInternalError");console.log("serverErrorMsg num is:",serverErrorMsg);if(serverErrorMsg){setTimeout(function(){jQuery('#print-alliedpay #counter-msg').show();jQuery('#print-alliedpay #counter-msg').text("Your request failed, please try again!");jQuery('#print-alliedpay #msg').hide();},4000);}}}}}).catch((error)=>{console.log(error);});}catch(e){console.log("Error in req",e);}}
function setPayFormRequest(formField,utilyID,billConstant,billMonth,labelKeys){var uID=utilyID;var billerConst=billConstant;var name=formField.field_customer_nameaeb8ede9682;var custNameLength=name.length;var maxLength=30;var finalName="";var missingLength=maxLength-custNameLength;for(var i=0;i<missingLength;i++){finalName=name+=" ";}
var amountB=formField.field_amount_before_due_datecafebdf11e2;var amountA=formField.field_amount_after_due_date6cb5fdae0a2;var amountBLength=amountB.length;var amountALength=amountA.length;var amountMaxLength=11;var amountBefore="";var amountAfter="";var missingLengthAmountBefore=amountMaxLength-amountBLength;for(var i=0;i<missingLengthAmountBefore;i++){amountBefore=amountB+="0";}
var missingLengthAmountAfter=amountMaxLength-amountALength;for(var i=0;i<missingLengthAmountAfter;i++){amountAfter=amountA+="0";}
var totalLengthB=amountBefore.length;var indexB=totalLengthB-missingLengthAmountBefore;var splitAmountBefore=amountBefore.substr(0,indexB);var totalLengthA=amountAfter.length;var indexA=totalLengthA-missingLengthAmountBefore;var splitAmountAfter=amountAfter.substr(0,indexA);var countZeroForB="";var countZeroForA="";var finalAmountBefore;var finalAmountAfter;function reverseString(amountB,amountA){for(var i=amountB.length-1;i>=indexB;i--){countZeroForB+=amountB[i];}
finalAmountBefore="+"+countZeroForB+splitAmountBefore;for(var i=amountA.length-1;i>=indexA;i--){countZeroForA+=amountA[i];}
finalAmountAfter="+"+countZeroForA+splitAmountAfter;finalAmountBefore=finalAmountBefore+"00";finalAmountAfter=finalAmountAfter+"00";}
reverseString(amountBefore,amountAfter);var dueDateformat=formField.field_due_date141ee580b12;var splitDate=dueDateformat.split("/");var dday=splitDate[0];var dmonth=splitDate[1];var dyear=splitDate[2];var dueDate=dyear+dday+dmonth;var additionalMaxLength=50;var makeArray=[];var finalString="";function handleCalTotal(){for(var[key,value]of Object.entries(formField)){if(key.includes("add_field_")){var findLength=value.length;var missingLength=additionalMaxLength-findLength;for(var i=0;i<missingLength;i++){finalString=value+=" ";}
finalString+=",";makeArray.push(finalString);}}
var res=makeArray.join("");additinalKeyValues=res.slice(0,-1);}
handleCalTotal();if(finalName!==""&&billMonth!==""&&dueDate!==""&&finalAmountBefore!==""&&finalAmountAfter!==""){var reqBillData=`${finalName},${billMonth},${dueDate},${finalAmountBefore},${finalAmountAfter}`;console.log("reqBillData on main field-->",reqBillData);var finalReq={utilityCompanyID:uID,billerConstant:billerConst,consumerNumber:"",billData:reqBillData,};var tokenFromLocalStorage=localStorage.getItem("authorization_token");var authFromVariable;if(authApiRespons){authFromVariable=authApiRespons.access_token;}
billingPayForm(finalReq,tokenFromLocalStorage||authFromVariable,"","");}
var isAdditionKey=Object.keys(formField).filter((itm)=>{return itm.includes("add_field_");});if(isAdditionKey.length>0){var reqBillData=`${finalName},${billMonth},${dueDate},${finalAmountBefore},${finalAmountAfter},${additinalKeyValues}`;var finalReq={utilityCompanyID:uID,billerConstant:billerConst,consumerNumber:"",billData:reqBillData,};console.log("finalReq--->",finalReq);var tokenFromLocalStorage=localStorage.getItem("authorization_token");var authFromVariable=authApiRespons.access_token;billingPayForm(finalReq,tokenFromLocalStorage||authFromVariable,labelKeys);}}
jQuery("body.page-allied-pay form#form_alliedpay").on("submit",function(e){e.preventDefault();var comapnyID=jQuery("#field_utilitycompany_id697a21b0292").val();var billerConst=jQuery("#field_biller_constanta5a08897132").val();var billingMonth=jQuery("#field_billing_month91dcdc3b472").val();var monthFieldID=jQuery(this).find(".req-data.frm_form_field.frm_first").prev().attr("id");var monthFieldValue=jQuery("#"+monthFieldID).val();console.log("monthFieldValue",monthFieldValue);var splitDate=monthFieldValue.split("/");var splitDateMonth=splitDate[0];var splitDateYear=splitDate[1];var billMonth=splitDateYear+splitDateMonth;var form=jQuery(this);var mandatoryData={};var combinedData={};var cloneData={};if(jQuery(".req-data.frm_form_field").length>0){form.find(".req-data.frm_form_field [id]").each(function(i,v){var input=jQuery(this),name=input.attr("id"),value=input.val();if(value!==""){mandatoryData[name]=value;}});setPayFormRequest(mandatoryData,comapnyID,billerConst,billMonth,exactKeys);}
var countDiv=jQuery(".additional-fields.frm_form_field:visible").length;if(countDiv===1){if(jQuery(".additional-fields.frm_form_field:visible .pay_add_field").length>0){form.find(".additional-fields.frm_form_field:visible .pay_add_field input, .additional-fields.frm_form_field:visible .pay_add_field select").each(function(i,v){var input=jQuery(this),name=input.attr("id"),value=input.val();labelID=jQuery(this).prev().attr("id");labelValue=jQuery("#"+labelID).text();labelValue.replace("*"," ");if(value!==""){if(jQuery(this).attr("type")==="checkbox"){var isDisabled=jQuery(this).prop("disabled");checkboxLable=jQuery(this).closest(".additional-fields.frm_form_field:visible .pay_add_field").find(".frm_primary_label").text();if(!isDisabled){var checkboxKey=jQuery(this).attr("id");var checkboxValue=jQuery(this).val();additionalFieldData["add_"+checkboxKey]=checkboxValue;labelDetail["add_"+checkboxLable]=checkboxValue;}else{additionalFieldData["add_"+checkboxKey]=" ";labelDetail["add_"+checkboxLable]=" ";}}else{additionalFieldData["add_"+name]=value;labelDetail["add_"+labelValue]=value;}}});for(var[key,value]of Object.entries(additionalFieldData)){var nameSplitKeys=key.split("-0");var nameReqKeys=nameSplitKeys[0];filterAdditionalFieldData[nameReqKeys]=value;}
for(var[key,value]of Object.entries(labelDetail)){objKeys=`${key}`;splitKeys=objKeys.split("*\n");if(splitKeys){splitKeysMore=splitKeys[0].split("add_");splitValue=splitKeysMore[1];exactKeys[splitValue]=" ";}}
combinedData=Object.assign(mandatoryData,filterAdditionalFieldData);setPayFormRequest(combinedData,comapnyID,billerConst,billMonth,exactKeys);}}
console.log("combinedData field--->",combinedData);console.log("Additional fields data --->",filterAdditionalFieldData);});jQuery("#field_company2").change(function(){var dueAmnt;var checkBoxVal;setTimeout(function(){checkBoxVal=jQuery("#field_editable_amount2").val();console.log("value is this: ",checkBoxVal);if(checkBoxVal=="Yes"){dueAmnt=jQuery(".due-amount input").val();console.log("amount outside: ",dueAmnt);jQuery(".amount-after-due input").val(dueAmnt);jQuery(".due-amount input").attr("readonly",false);jQuery(".due-amount input").change(function(){dueAmnt=jQuery(".due-amount input").val();console.log("amount: ",dueAmnt);jQuery(".amount-after-due input").val(dueAmnt);});}else{jQuery(".due-amount input").attr("readonly",true);}},6500);});});