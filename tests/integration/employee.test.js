
const request=require('supertest');
const Employee=require('../../models/employee');
let server;

describe('/api/employee',()=>{
    beforeEach(()=>{server=require('../../app');});
    afterEach(()=>{server.close();});
    describe('POST /signUp',async()=>{
        let employee;
        let name;
        let email;
        let password;
        let userLevel;
        let superAdminAuth;
        beforeEach(async () => {
            name="Ratan Tata";
            email="ratantata@gmail.com";
            password="ratantata@101";
            userLevel=true;
            let newEmployee={
                name:name,
                email:email,
                password:password,
                userLevel:userLevel
            }
            employee=new Employee(newEmployee);
            await employee.save();
            superAdminAuth=employee.generateAuthToken();
            name="APJ Abdul Kalam";
            email="apjkalam@gmail.com";
            password="apjabdul@INDIA";
            userLevel=false;
            let newEmployee={
                name:name,
                email:email,
                password:password,
                userLevel:userLevel
            }
            employee=new Employee(newEmployee);
            await employee.save();
          });
          afterEach(async()=>{
              await Employee.remove({});
          })
          
          const exec = async () => {
            return  await request(server)
            .post('/api/employee/signUp')
            .set('x-super-auth-token',superAdminAuth)
            .send({name:name,email:email,password:password,userLevel:userLevel});
          }
          it('should return 400 if anyone is creating with userLevel=true',async()=>{
            userLevel=true;
            const res=await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if name length is less than or equal to zero characters',async()=>{
            name='';
            const res=await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if email is not properly entered',async()=>{
            email='himgmail.com';
            const res=await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if password length is less than 8 characters',async()=>{
            password='1234';
             const res=await exec();
            expect(res.status).toBe(400);
        });
        it('should return 401 if token is invalid',async()=>{
            superAdminAuth='';
            const res=await exec();
            expect(res.status).toBe(401);
        });

        it('should return 200 if all inputs are valid',async()=>{
            const res =  await exec();;
            expect(res.status).toBe(200);
        });
       
    });
    describe('POST /logIn',async()=>{
        let employee;
        let name;
        let email;
        let password;
        let userLevel;
        
        beforeEach(async () => {
            name="Ratan Tata";
            email="ratantata@gmail.com";
            password="ratantata@101";
            userLevel=false;
            let newEmployee={
                name:name,
                email:email,
                password:password,
                userLevel:userLevel
            }
            employee=new Employee(newEmployee);
            await employee.save();
        });
          afterEach(async()=>{
              await Employee.remove({});
          })
          const exec = async () => {
            return  await request(server)
            .post('/api/employee/logIn')
            .send({email:email,password:password});
          }
          it('should return 404 if employee enter an invalid email address',async()=>{
            email="himanshgmail.com";
            const res=await exec();
            expect(res.status).toBe(400);
        });
        
            it('should return 404 if employee with given email is not present',async()=>{
                email="him1hi@gmail.com";
                const res=await exec();
                expect(res.status).toBe(404);
            });
           
            it('should return 400 if password is wrong',async()=>{
                password='12364649';
                const res=await exec();
                expect(res.status).toBe(400);
            });
            it('should return 200 if successfully logged in ',async()=>{
                const res=await exec();
                expect(res.status).toBe(200);
            });
    });
});