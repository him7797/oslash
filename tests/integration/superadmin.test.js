const request=require('supertest');
const User=require('../../models/user');
const Employee=require('../../models/employee');
const AdminPost=require('../../models/adminpost');
const Post=require('../../models/post');
let server;


describe('/api/superadmin',()=>{
        let user;
        let description;
        let postBy;
        let post;
        let postId;
        let employee;
        let empToken;
        let admin;
        let empId;
        let approval;
        let adminPostId;
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
               empId=employee._id;
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
                adminPostId=admin._id;
                let newEmployee={
                    name:"APJ Abdul Kalam",
                    email:"abdulkalam@gmail.com",
                    password:"abdulkalam@101",
                    userLevel:true
                }
                employee=new Employee(newEmployee);
                await employee.save();
                empToken=employee.generateAuthToken();
            });
  
    afterEach(async()=>{
        server.close();
        await User.remove({});
        await Employee.remove({});
        await AdminPost.remove({});
        await Post.remove({});
    });
    describe('POST /approve/:id',async()=>{
        
        approval=true;
        const exec = async () => {
            return  await request(server)
            .post('/api/superadmin/approve/'+adminPostId)
            .set('x-super-auth-token', empToken)
            .send({approval:approval});
          }
          it('should return 401 if token is invalid',async()=>{
            empToken='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 200 if successfully changed approval',async()=>{
            const res=await exec();
            expect(res.status).toBe(200);
        });

    })
    describe('GET  /adminpost',async()=>{
        const exec = async () => {
            return  await request(server)
            .get('/api/superadmin/adminpost')
            .set('x-super-auth-token', empToken)
          }
          it('should return 401 if token is invalid',async()=>{
            empToken='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 200 if successfully changed approval',async()=>{
            const res=await exec();
            expect(res.status).toBe(200);
        });
    });
    describe('GET  /all/admins',async()=>{
        const exec = async () => {
            return  await request(server)
            .get('/api/superadmin/all/admins')
            .set('x-super-auth-token', empToken)
          }
          it('should return 401 if token is invalid',async()=>{
            empToken='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 200 if successfully changed approval',async()=>{
            const res=await exec();
            expect(res.status).toBe(200);
        });
    });
})