import java.sql.*;

public class TransactionDemo {

    static void transfer(
        Connection con,
        int from,
        int to,
        double amount) throws Exception {

        try {

            con.setAutoCommit(false);

            PreparedStatement debit =
                con.prepareStatement(
                    "UPDATE accounts SET balance=balance-? WHERE id=?");

            debit.setDouble(1, amount);
            debit.setInt(2, from);

            PreparedStatement credit =
                con.prepareStatement(
                    "UPDATE accounts SET balance=balance+? WHERE id=?");

            credit.setDouble(1, amount);
            credit.setInt(2, to);

            debit.executeUpdate();
            credit.executeUpdate();

            con.commit();

        } catch(Exception e) {

            con.rollback();
        }
    }
}