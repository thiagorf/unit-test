import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Show User Profile Use Case", () => {

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		createUserUseCase = new CreateUserUseCase(usersRepository);
		showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
	})

	it("Should be able to show a user profile", async () => {
		const user = await createUserUseCase.execute({
			name: "Thiago",
			email: "thiago@gmail.com",
			password: "1234"
		});

		const userProfile = await showUserProfileUseCase.execute(user.id as string);

		expect(userProfile).toBeInstanceOf(User);
	});

	it("Should not be able to show a profile for a inexisting user", () => {
		expect(async () => {
			await showUserProfileUseCase.execute('4564');
		}).rejects.toBeInstanceOf(AppError);
	})
})