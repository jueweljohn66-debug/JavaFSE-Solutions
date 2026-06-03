import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class FileWriteDemo {

    public static void main(String[] args) {

        try (Scanner sc = new Scanner(System.in)) {

            System.out.print("Enter text: ");
            String text = sc.nextLine();

            try (FileWriter fw = new FileWriter("output.txt")) {

                fw.write(text);

                System.out.println(
                        "Data written successfully.");

            } catch (IOException e) {

                System.out.println(e.getMessage());
            }
        }
    }
}