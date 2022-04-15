import React from 'react';
import styled from 'styled-components';
import Link from '../components/link';
import Layout from '../components/layout';
import SEO from '../components/seo';

const CompanyS = styled.div`
  margin-bottom: 3rem;
`;

const CompanyLinkS = styled.a`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Company = ({ name, children, link }) => (
  <CompanyS>
    <h3>
      <CompanyLinkS href={link} target="_blank" rel="noreferrer">
        {name}
      </CompanyLinkS>
    </h3>
    {children}
  </CompanyS>
);

const RoleNameS = styled.div`
  font-family: Monaco, 'Courier New', monospace;
  font-size: 85%;
  margin-bottom: 1rem;
  color: #aaa;
`;

const RoleS = styled.div`
  margin-bottom: 2rem;
`;

const RoleChildrenS = styled.div``;
const StackTagsS = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 1rem;
  gap: 0.2rem;
  font-size: 80%;
`;
const StackTagS = styled.li`
  padding: 0.2rem 0.4rem;
  margin: 0 0.4rem 0.4rem 0;
  background-color: #efefef;
  border-radius: 2px;
  display: inline-block;
`;
const Role = ({ role, start, end, stack, children }) => {
  return (
    <RoleS>
      <RoleNameS>
        {role} ({start} - {end || 'now'})
      </RoleNameS>
      <RoleChildrenS>{children}</RoleChildrenS>
      {stack ? (
        <StackTagsS>
          {stack.map((s) => (
            <StackTagS key={s}>{s}</StackTagS>
          ))}
        </StackTagsS>
      ) : (
        <></>
      )}
    </RoleS>
  );
};

const TitleS = styled.h1`
  font-size: 2rem;
`;

const ResumeS = styled.div`
  line-height: 1.6;
`;

const Resume = ({ location }) => {
  return (
    <Layout>
      <SEO title="Resume" location={location} />
      <ResumeS>
        <TitleS>Resume</TitleS>
        <p>I am currently a Principal Software Engineer at GoCardless</p>
        <p>
          My passion is building complex technical systems/products and growing high performing engineering teams. I've
          spent most of my career at the pointy end of startups and new businesses in regulated environments such as
          healthcare and (more recently) fintech.
        </p>
        <p>
          Outside of work I love travel, food (especially all things{' '}
          <a target="_blank" href="/2021/08/26/sandwich-loaf">
            bread
          </a>{' '}
          and{' '}
          <a href="https://www.instagram.com/p/BpZW1b4HE5m/" target="_blank" rel="noreferrer">
            pastries
          </a>
          ), and{' '}
          <a
            href="
    https://twitter.com/mnbbrown/status/1487054469770612737?s=20&t=BjnBvytvzqHdeyzNXJfBHA
    "
            target="_blank"
            rel="noreferrer"
          >
            aviation
          </a>{' '}
          - if all goes the plan I'll have my{' '}
          <a href="https://twitter.com/mnbbrown/status/1502738382782349316?s=20&t=BjnBvytvzqHdeyzNXJfBHA">PPL(A)</a>{' '}
          within the month. I have aspirations to continue my training (IR, Night, Multi-Engine and Commercial) and one
          day fly from the{' '}
          <a href="https://en.wikipedia.org/wiki/Kangaroo_Route" target="_blank" rel="noreferrer">
            UK to Australia
          </a>{' '}
          in a zero-emission aircraft.
        </p>
        <p>
          I also have a bunch of side projects that I like to work on when time allows including an operations and
          scheduling app for flight schools and a flight telemetry app for student pilots.
        </p>
        <p>Below is a snapshot of my career so far...</p>
        <br />
        <Company name="GoCardless" link="https://gocardless.com/">
          <Role
            role="Principal Software Engineer"
            start="July 2021"
            stack={[
              'Ruby on Rails',
              'Python',
              'GCP BigQuery',
              'PostgreSQL',
              'Apache Flink',
              'GCP Pub/Sub',
              'React',
              'Kubernetes',
            ]}
          >
            At GoCardless I work with the product teams responsible for managing our risk - across anti-fraud,
            anti-money laundering, compliance and credit risk.
          </Role>
        </Company>
        <Company name="BCG Digital Ventures (DV)" link="https://bcgdv.com/">
          <Role role="Venture CTO" start="June 2020" end="July 2021">
            <p>As a CTO I led engineering on several successful DV ventures.</p>
            <p>
              This included driving the technical architecture and delivery of complex builds within very compressed
              timeframes, coordinating with product, design and commercial leadership, and communicating with
              stakeholders such as the board and venture partners.
            </p>
          </Role>
          <Role role="Senior Engineer" start="June 2020" end="July 2021">
            As the innovation, incubation and investment arm of The Boston Consulting Group, BCG Digital Ventures
            invents, launches and invests in game-changing businesses with the world’s most influential corporations.
          </Role>
        </Company>
        <Company name="Stealth IoT Venture (via DV)">
          <Role
            role="CTO"
            stack={[
              'OEM hardware',
              'Zigbee',
              'Buildroot',
              'linux',
              'Python',
              'Go',
              'AWS IoT Core',
              'AWS DynamoDB',
              'Fargate',
              'Kinesis Analytics',
              'Apache Flink',
              'AWS Lambda',
              'React/React Native',
            ]}
          >
            Leading a team of ~20 engineers building a product that will transform the delivery of social care in the
            UK. This involved technical architecture and delivery of an ecosystem of hardware sensors, real time
            analytics and alerting platform, mobile app and web app.
          </Role>
        </Company>
        <Company name="Epsy Health (via DV)" link="https://epsyhealth.com/">
          <Role
            role="CTO"
            stack={[
              'OEM hardware',
              'Zigbee',
              'Buildroot',
              'linux',
              'Python',
              'Go',
              'AWS IoT Core',
              'AWS DynamoDB',
              'Fargate',
              'Kinesis Analytics',
              'Apache Flink',
              'AWS Lambda',
              'React/React Native',
            ]}
          >
            Leading a team of ~20 engineers building a product that will transform the delivery of social care in the
            UK. This involved technical architecture and delivery of an ecosystem of hardware sensors, real time
            analytics and alerting platform, mobile app and web app.
          </Role>
        </Company>
        <h2>Education</h2>
        <p>Bachelor of Business, Queensland University of Technology </p>
        <h2>Other important bits</h2>
        <p>I have the right to work in both the United Kingdom and Australia without sponsorship.</p>
      </ResumeS>
    </Layout>
  );
};

export default Resume;
