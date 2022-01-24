import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;


describe("Create User Use Case Test", () => {

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		userUseCase = new CreateUserUseCase(usersRepository);
	})

	it("Should be able to create a User", async () => {
		const user = await userUseCase.execute({
			name: "Thiago",
			email: "thiago@gmail.com",
			password: "1234"
		});

		expect(user).toHaveProperty('id');
	});
	

	it("Should not be able to create a user with the same e-mail", () => {
		expect(async () => {
			const validUser = await userUseCase.execute({
				name: "Thiago",
				email: "thiago@gmail.com",
				password: "1234"
			});
			
			const invalidUser = await userUseCase.execute({
				name: "Thiago",
				email: "thiago@gmail.com",
				password: "1234"
			});
		}).rejects.toBeInstanceOf(CreateUserError);
	})
})