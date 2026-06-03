import java.util.Scanner;

class InvalidAgeException extends Exception {
    public InvalidAgeException(String message) {
        super(message);
    }
}

public class CustomExceptionDemo {

    public static void main(String[] args) {

        try (Scanner sc = new Scanner(System.in)) {

            System.out.print("Enter age: ");
            int age = sc.nextInt();

            if(age < 18) {
                throw new InvalidAgeException(
                        "Age must be 18 or above.");
            }

            System.out.println("Eligible");

        } catch (InvalidAgeException e) {

            System.out.println(e.getMessage());
        }
    }
}