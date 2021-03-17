
const request=require('supertest');
const User=require('../../models/user');
const Post=require('../../models/post');
const Employee=require('../../models/employee');
const AdminPost=require('../../models/adminpost');
let server;

describe('/api/admin',()=>{
        let user;
        let description;
        let postBy;
        let post;
        let postId;
        let employee;
        let empToken;
        let admin;
        let empId;
        let type;
    beforeEach(async()=>{
        server=require('../../app');
        
        let newUser={
             name:"Himanhsu Upadhyay",
             password:"HIM101hi@",
             email:"himanshu101hi@gmail.com"
            }
            user=new User(newUser);
            await user.save();
            description="Hi there this is testing";
            postBy=user._id;
            let newPost={
            description:description,
            postBy:postBy
            }
            post=new Post(newPost);
            await post.save();
            postId=post._id;
            let newEmployee={
                name:"Ratan Tata",
                email:"ratantata@gmail.com",
                password:"ratantata@101",
                userLevel:false
            }
            employee=new Employee(newEmployee);
            await employee.save();
            empToken=employee.generateAuthToken();
            empId=employee._id;
    });
    afterEach(async()=>{
        server.close();
        await Employee.remove({});
        await Post.remove({});
        await User.remove({});
    });
    describe('GET /users/posts',async()=>{
        const exec = async () => {
            return  await request(server)
            .get('/api/admin/users/posts')
            .set('x-admin-auth-token', empToken)
          }

        it('should return 401 if token is invalid',async()=>{
            empToken='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 200 if all input are valid',async()=>{
            const res=await exec();
            expect(res.status).toBe(200);
        });
       
    });
    describe('POST /:id',async()=>{
        beforeEach(async () => {
            description="Hi there this is testing";
            type="CREATE";
            let newAdminPost={
                post:postId,
                postDescription:description,
                type:"CREATE",
                employee:empId,
            }
            admin=new AdminPost(newAdminPost);
            await admin.save();
          });
          afterEach(async()=>{
              await AdminPost.remove({});
          })
          const exec = async () => {
            return  await request(server)
            .post('/api/admin/'+postId)
            .set('x-admin-auth-token',empToken)
            .send({description:description});
          }
        
          it('should return 401 if token is invalid',async()=>{
            empToken='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 400 if description length is less than 1 character',async()=>{
            description='';
            const res=await exec();
            expect(res.status).toBe(400);
        });
           
        it('should return 200 if admin post successfully created ',async()=>{
            const res=await exec();
            expect(res.status).toBe(200);
        });


    });

    describe('DELETE /:id',async()=>{
        beforeEach(async () => {
            
            type="DELETE";
            let newAdminPost={
                post:postId,
                type:type,
                employee:empId,
            }
            admin=new AdminPost(newAdminPost);
            await admin.save();
          });
          afterEach(async()=>{
              await AdminPost.remove({});
          })
          const exec = async () => {
            return  await request(server)
            .delete('/api/admin/'+postId)
            .set('x-admin-auth-token',empToken)
          }
        
          it('should return 401 if token is invalid',async()=>{
            empToken='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 200 if admin post successfully created ',async()=>{
            const res=await exec();
            expect(res.status).toBe(200);
        });


    });
    describe('PUT /:id',async()=>{
        beforeEach(async () => {
            description="Hi there here it is changed"
            type="UPDATE";
            let newAdminPost={
                post:postId,
                type:type,
                postDescription:description,
                employee:empId,
            }
            admin=new AdminPost(newAdminPost);
            await admin.save();
          });
          afterEach(async()=>{
              await AdminPost.remove({});
          })
          const exec = async () => {
            return  await request(server)
            .put('/api/admin/'+postId)
            .set('x-admin-auth-token',empToken)
            .send({description:description});
          }
        
          it('should return 401 if token is invalid',async()=>{
            empToken='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 400 if description length is less than 1 character',async()=>{
            description='';
            const res=await exec();
            expect(res.status).toBe(400);
        });
        it('should return 200 if admin post successfully created ',async()=>{
            const res=await exec();
            expect(res.status).toBe(200);
        });


    });

});