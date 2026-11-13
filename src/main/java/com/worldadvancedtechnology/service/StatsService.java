package com.worldadvancedtechnology.service;

import com.worldadvancedtechnology.entity.VisitStat;
import com.worldadvancedtechnology.repo.VisitStatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Records and aggregates visitor statistics (page views and unique daily
 * visitors). Increments are synchronized — fine for a single-instance site.
 */
@Service
public class StatsService {

    private final VisitStatRepository repo;

    public StatsService(VisitStatRepository repo) {
        this.repo = repo;
    }

    private static String today() {
        return LocalDate.now().toString();
    }

    @Transactional
    public synchronized void recordVisit(boolean uniqueToday) {
        String day = today();
        VisitStat s = repo.findById(day).orElseGet(() -> new VisitStat(day));
        s.setViews(s.getViews() + 1);
        if (uniqueToday) s.setVisitors(s.getVisitors() + 1);
        repo.save(s);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> stats() {
        List<VisitStat> all = repo.findAll();
        long totalViews = 0, totalVisitors = 0;
        for (VisitStat s : all) { totalViews += s.getViews(); totalVisitors += s.getVisitors(); }

        String today = today();
        VisitStat todayStat = repo.findById(today).orElse(new VisitStat(today));

        // Last 14 days, filling gaps with zeros.
        Map<String, VisitStat> byDay = new LinkedHashMap<>();
        for (VisitStat s : all) byDay.put(s.getDay(), s);
        List<Map<String, Object>> daily = new ArrayList<>();
        for (int i = 13; i >= 0; i--) {
            String d = LocalDate.now().minusDays(i).toString();
            VisitStat s = byDay.get(d);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("day", d);
            row.put("views", s == null ? 0 : s.getViews());
            row.put("visitors", s == null ? 0 : s.getVisitors());
            daily.add(row);
        }

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("totalViews", totalViews);
        out.put("totalVisitors", totalVisitors);
        out.put("todayViews", todayStat.getViews());
        out.put("todayVisitors", todayStat.getVisitors());
        out.put("daysTracked", all.size());
        out.put("daily", daily);
        return out;
    }
}
