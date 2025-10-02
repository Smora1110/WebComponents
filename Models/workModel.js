const WorkModel = {
    countries:{
        id: '',
        name: ''
    },
    regions:{
        id: '',
        name: '',
        CountryId:''
    },
    cities:{
        id: '',
        name: '',
        RegionId:''
    },
    companies:{
        id: '',
        name: '',
        niu:'',
        CityId:'',
        adress:'',
        email:''
    },
    branches:{
        id: '',
        number_Comercial: '',
        niu:'',
        Contact_name:'',
        adress:'',
        email:'',
        phone:'',
        cityId:'',
        CompanyId:''
    }


}
export default WorkModel;