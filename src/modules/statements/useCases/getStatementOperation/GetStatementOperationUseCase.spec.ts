import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let usersRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;


describe("Get Statement Operation Use Case", () => {

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		statementRepository = new InMemoryStatementsRepository();
		getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementRepository);
	})

	it("Should be able to get statement operation", async () => {

		const user = await usersRepository.create({
			name: "Thiago",
			email: "thiago@gmail.com",
			password: "1234"
		});

		const statement = await statementRepository.create({
			user_id: user.id as string,
			type: OperationType.DEPOSIT,
			description: "test",
			amount: 100
		});

		await getStatementOperationUseCase.execute({
			statement_id: statement.id as string,
			user_id: user.id as string
		})
	});

	it("should not be able to get a statement to an inexisting user", () => {
		expect(async () => {
			const user = await usersRepository.create({
				name: "Thiago",
				email: "thiago@gmail.com",
				password: "1234"
			});

			const statement = await statementRepository.create({
				user_id: user.id as string,
				type: OperationType.DEPOSIT,
				description: "test",
				amount: 100
			});

			await getStatementOperationUseCase.execute({
				statement_id: statement.id as string,
				user_id: "1234"
			});

		}).rejects.toBeInstanceOf(AppError)
	})

	it("should not be able to get a statement to an inexisting statement", () => {
		expect(async () => {
			const user = await usersRepository.create({
				name: "Thiago",
				email: "thiago@gmail.com",
				password: "1234"
			});

			await getStatementOperationUseCase.execute({
				statement_id: "1234",
				user_id: user.id as string
			});

		}).rejects.toBeInstanceOf(AppError)
	})
})