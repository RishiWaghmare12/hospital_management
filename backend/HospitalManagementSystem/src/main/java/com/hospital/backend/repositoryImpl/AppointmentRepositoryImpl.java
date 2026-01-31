package com.hospital.backend.repositoryImpl;

import com.hospital.backend.EmailService;
import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.sql.Time;

@Repository
public class AppointmentRepositoryImpl implements AppointmentRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Appointment> appointmentRowMapper = new RowMapper<Appointment>() {
        @Override
        public Appointment mapRow(ResultSet rs, int rowNum) throws SQLException {
            Appointment appointment = new Appointment();
            appointment.setApId(rs.getInt("Ap_ID"));
            appointment.setpId(rs.getInt("P_ID"));
            appointment.setDrId(rs.getInt("DR_ID"));
            appointment.setDescript(rs.getString("Descript"));
            appointment.setCancelConfirm(rs.getInt("cancel_confirm"));
            appointment.setAppointmentDate(rs.getDate("appointment_date"));
            appointment.setAppointmentTime(rs.getTime("appointment_time"));
            appointment.setStatus(rs.getString("status"));
            return appointment;
        }
    };

    @Override
    public Optional<Appointment> getAppointmentById(int id) {
        String sql = "SELECT * FROM appointment WHERE Ap_ID = ?";
        List<Appointment> appointments = jdbcTemplate.query(sql, appointmentRowMapper, id);
        return appointments.isEmpty() ? Optional.empty() : Optional.of(appointments.get(0));
    }

    @Override
    public boolean existsById(int id) {
        String sql = "SELECT COUNT(*) FROM appointment WHERE Ap_ID = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    @Override
    public List<Appointment> getAppointmentsByDoctor(int doctorId) {
        String sql = "SELECT * FROM appointment WHERE DR_ID = ?";
        return jdbcTemplate.query(sql, appointmentRowMapper, doctorId);
    }

    @Override
    public List<Appointment> getAppointmentsByPatient(int patientId) {
        String sql = "SELECT * FROM appointment WHERE P_ID = ?";
        return jdbcTemplate.query(sql, appointmentRowMapper, patientId);
    }

    @Override
    public List<Appointment> getAppointmentsByStatus(String status) {
        String sql = "SELECT * FROM appointment WHERE status = ?";
        return jdbcTemplate.query(sql, appointmentRowMapper, status);
    }

    @Override
    public List<Appointment> getAppointmentsByDate(String date) {
        String sql = "SELECT * FROM appointment WHERE appointment_date = ?";
        return jdbcTemplate.query(sql, appointmentRowMapper, date);
    }

    @Override
    public Appointment createAppointment(Appointment appointment) {
        if (appointment.getApId() == 0) {
            String sql = "INSERT INTO appointment (P_ID, DR_ID, Descript, cancel_confirm, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                    appointment.getpId(),
                    appointment.getDrId(),
                    appointment.getDescript(),
                    appointment.getCancelConfirm(),
                    appointment.getAppointmentDate(),
                    appointment.getAppointmentTime(),
                    appointment.getStatus());
            return appointment;
        } else {
            String sql = "UPDATE appointment SET P_ID = ?, DR_ID = ?, Descript = ?, cancel_confirm = ?, appointment_date = ?, appointment_time = ?, status = ? WHERE Ap_ID = ?";
            jdbcTemplate.update(sql,
                    appointment.getpId(),
                    appointment.getDrId(),
                    appointment.getDescript(),
                    appointment.getCancelConfirm(),
                    appointment.getAppointmentDate(),
                    appointment.getAppointmentTime(),
                    appointment.getStatus(),
                    appointment.getApId());
            return appointment;
        }
    }

    @Override
    public void deleteAppointment(int id) {
        String sql = "DELETE FROM appointment WHERE Ap_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        String sql = "SELECT * FROM appointment";
        return jdbcTemplate.query(sql, appointmentRowMapper);
    }

    @Override
    public Appointment updateAppointment(Appointment appointment) {
        if (appointment.getApId() == 0) {
            throw new IllegalArgumentException("Appointment ID must be provided for update");
        }
        return createAppointment(appointment);
    }

    @Override
    public Appointment updateStatus(int id, String status) {
        String sql = "UPDATE appointment SET status = ? WHERE Ap_ID = ?";
        jdbcTemplate.update(sql, status, id);

        return getAppointmentById(id).orElse(null);
    }

    @Override
    public List<Appointment> getUpcomingAppointments(int doctorId) {
        String sql = "SELECT * FROM appointment WHERE DR_ID = ? " +
                "AND (appointment_date > CURDATE() OR " +
                "(appointment_date = CURDATE() AND appointment_time > CURTIME())) " +
                "AND status = 'cancel' " + // Or 'CONFIRMED' depending on your needs
                "ORDER BY appointment_date, appointment_time";

        return jdbcTemplate.query(sql, appointmentRowMapper, doctorId);
    }

    @Override
    public List<Appointment> getPastAppointments(int doctorId) {
        String sql = "SELECT * FROM appointment WHERE DR_ID = ? AND (appointment_date < CURDATE() OR (appointment_date = CURDATE() AND appointment_time < CURTIME())) ORDER BY appointment_date DESC, appointment_time DESC";

        return jdbcTemplate.query(sql, appointmentRowMapper, doctorId);
    }

    @Override
    public List<Appointment> getTodayAppointments(int doctorId) {
        String sql = "SELECT * FROM appointment WHERE DR_ID = ? AND appointment_date = CURDATE() ORDER BY appointment_time ASC";

        return jdbcTemplate.query(sql, appointmentRowMapper, doctorId);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorAndDate(int doctorId, String date) {
        String sql = "SELECT * FROM appointment WHERE DR_ID = ? AND appointment_date = ? ORDER BY appointment_time ASC";
        return jdbcTemplate.query(sql, appointmentRowMapper, doctorId, date);
    }

}