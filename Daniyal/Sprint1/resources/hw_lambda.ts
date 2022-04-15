exports.handler = async function(event:any){
    return ('Hello ${event.firstname} ${event.lastname}. Nice to meet you');

};