import java.util.HashMap;
import java.util.Scanner;

public class HashMapDemo {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        HashMap<Integer, String> students =
                new HashMap<>();

        System.out.print("How many students? ");
        int n = sc.nextInt();

        for(int i = 0; i < n; i++) {

            System.out.print("Enter ID: ");
            int id = sc.nextInt();

            sc.nextLine();

            System.out.print("Enter Name: ");
            String name = sc.nextLine();

            students.put(id, name);
        }

        System.out.print("Search ID: ");
        int searchId = sc.nextInt();

        System.out.println(
                "Name: " + students.get(searchId));
                sc.close();
    }
    
}